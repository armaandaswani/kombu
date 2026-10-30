// Stories are published only by the existing scheduled Worker, with its existing token.
export const localDate = (now = new Date()) => new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Manaus', year: 'numeric', month: '2-digit', day: '2-digit'}).format(now);
export function validateDay(manifest, date) {
  const day = manifest.days?.find(d => d.date === date);
  if (!day) return null;
  if (!Array.isArray(day.frames) || day.frames.length !== 5) throw new Error('Stories: o dia precisa de cinco artes');
  if (new Set(day.frames.map(f => f.id)).size !== 5) throw new Error('Stories: ids repetidos');
  for (const f of day.frames) {
    if (!/^[a-z0-9-]+$/.test(f.id) || !/^stories\/[a-z0-9-]+\/[a-z0-9-]+\.jpg$/.test(f.image) || !f.image.startsWith('stories/' + date + '/')) throw new Error('Stories: caminho inválido');
  }
  return day;
}
// Cloudflare supplies the scheduled timestamp, so a delayed invocation keeps its slot.
export function isFeedTime(now) {
  return now.getUTCMinutes() === 0 && now.getUTCHours() === 13;
}
export function storySlot(now) {
  const minute = now.getUTCMinutes();
  if (minute % 5) return null;
  // Normal sequence 07:00..07:20; remaining ticks only recover unfinished frames.
  if (now.getUTCHours() === 11) return minute / 5;
  // Incident catch-up authorized by the owner's request to fix the missed sequence.
  if (localDate(now) === '2026-10-30' && now.getUTCHours() === 12 && minute >= 30) return 5 + (minute - 30) / 5;
  return null;
}
export async function runStories(env, {call, currentToken, account, waitFinished, log}, now = new Date()) {
  const slot=storySlot(now);
  if(slot===null)return;
  if(!env.IG_TOKEN)throw Error('Stories: conexão da conta indisponível');
  const date=localDate(now), slotKey='stories:slot:'+date+':'+now.toISOString().slice(11,16);
  if(await env.STATE.get(slotKey)||await env.STATE.get('stories:done:'+date))return;
  const base='https://kombu-social.pages.dev/';
  const res=await fetch(base+'stories/manifest.json',{cache:'no-store'});
  if(!res.ok)throw Error('Stories: manifesto indisponível ('+res.status+')');
  const day=validateDay(await res.json(),date);
  if(!day)throw Error('Stories: sem artes para '+date);
  const token=await currentToken(env), user=await account(env,token);
  const info=await call('GET','/'+user.id,{fields:'account_type'},token);
  if(info.account_type!=='BUSINESS')throw Error('Stories: a Meta exige conta Business; tipo recebido: '+info.account_type);
  const complete=async()=>{
    const states=await Promise.all(day.frames.map(f=>env.STATE.get('story:'+date+':'+f.id)));
    if(states.every(s=>s&&JSON.parse(s).status==='published')){
      await env.STATE.put('stories:done:'+date,JSON.stringify({count:5,at:new Date().toISOString()}));
      await env.STATE.put('stories:health:'+date,JSON.stringify({status:'complete',count:5,at:new Date().toISOString()}));
      await log(env,'Stories: cinco artes publicadas para '+date);
    }
  };
  // Reconcile pending containers before any POST. Reuse the same container; never
  // recreate it following an ambiguous response or an inaccessible status.
  for(const frame of day.frames.slice(0,Math.min(slot+1,5))){
    const key='story:'+date+':'+frame.id;
    let state=JSON.parse(await env.STATE.get(key)||'null');
    if(state?.status==='published')continue;
    if(state?.status==='publishing'){
      if(!state.containerId)throw Error('Stories: confirmação pendente para '+frame.id+'; falta container');
      const result=await call('GET','/'+state.containerId,{fields:'status_code'},token);
      await log(env,'Stories: conciliação '+date+'/'+frame.id+' = '+result.status_code);
      if(result.status_code==='PUBLISHED'){
        await env.STATE.put(key,JSON.stringify({...state,status:'published',confirmedBy:'container-status',confirmedAt:new Date().toISOString()}));
        await complete();
        continue;
      }
      if(result.status_code==='FINISHED'){
        // FINISHED explicitly confirms this exact container is not yet published.
        if(Date.parse(now)-Date.parse(state.at)<120000)throw Error('Stories: aguardando conciliação para '+frame.id);
      }else if(['ERROR','EXPIRED'].includes(result.status_code)){
        await log(env,'Stories: container não publicado '+result.status_code+'; recriando '+frame.id);
        state=null;
      }else throw Error('Stories: confirmação pendente para '+frame.id+'; estado '+result.status_code);
    }
    let containerId=state?.containerId;
    if(!containerId){
      const image=await fetch(base+frame.image,{method:'HEAD'});
      if(!image.ok||!image.headers.get('content-type')?.includes('image/jpeg'))throw Error('Stories: imagem indisponível: '+frame.image);
      const container=await call('POST','/'+user.id+'/media',{media_type:'STORIES',image_url:base+frame.image},token);
      containerId=container.id;
      await waitFinished(containerId,token);
    }
    const attempt={status:'publishing',containerId,at:now.toISOString(),attempts:(state?.attempts||0)+1};
    await env.STATE.put(key,JSON.stringify(attempt));
    let published;
    try{
      published=await call('POST','/'+user.id+'/media_publish',{creation_id:containerId},token);
      if(!published?.id)throw Error('Stories: resposta sem confirmação da publicação');
    }catch(e){
      await env.STATE.put(key,JSON.stringify({...attempt,lastError:{httpStatus:e.httpStatus,code:e.code,subcode:e.subcode,definitive:!!e.definitive}}));
      throw e;
    }
    await env.STATE.put(key,JSON.stringify({...attempt,status:'published',mediaId:published.id,at:new Date().toISOString()}));
    await env.STATE.put(slotKey,JSON.stringify({id:frame.id,at:new Date().toISOString()}));
    await env.STATE.put('stories:health:'+date,JSON.stringify({status:'in-progress',lastFrame:frame.id,at:new Date().toISOString()}));
    await log(env,'Story publicado: '+date+'/'+frame.id);
    await complete();
    return; // one new Story per invocation, always five minutes apart
  }
  await complete();
}
