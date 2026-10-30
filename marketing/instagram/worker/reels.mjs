// Approved commercial exports only. Preparation may run before 09:00; publishing never does.
export async function runReel(env, deps, post, {publishAllowed=false, now=new Date()}={}) {
 if(post.format!=='reel'||!post.approvedAt||post.voice!=='none')throw Error('Reel não liberado para publicação comercial');
 const {call,log,user,token,imageBase}=deps;
 const key='reel:'+post.id;
 let state=JSON.parse(await env.STATE.get(key)||'null');
 const save=async(value)=>{state={...state,...value,at:now.toISOString()};await env.STATE.put(key,JSON.stringify(state));};
 const done=async(mediaId,at=now.toISOString())=>{
  await env.STATE.put('published:'+post.id,JSON.stringify({mediaId,at,format:'reel'}));
  await env.STATE.put('last',JSON.stringify({id:post.id,at}));
  await save({status:'published',mediaId});await log(env,'Reel confirmado '+post.id+' (media '+mediaId+')');return true;
 };
 if(await env.STATE.get('published:'+post.id))return true;
 if(state?.status==='creating'&&!state.containerId)throw Error('Reel com criação incerta; revisar antes de repetir: '+post.id);
 if(!state?.containerId){
  if(state?.status==='failed')throw Error('Reel requer revisão: '+post.id);
  for(const [file,type] of [[post.video,'video/mp4'],[post.cover,'image/jpeg']]){
   const res=await fetch(`${imageBase}/${post.id}/${file}`,{method:'HEAD'});
   if(!res.ok||!res.headers.get('content-type')?.startsWith(type))throw Error('Arquivo do Reel indisponível: '+file);
  }
  await save({status:'creating'});
  try{
   const c=await call('POST',`/${user.id}/media`,{media_type:'REELS',video_url:`${imageBase}/${post.id}/${post.video}`,cover_url:`${imageBase}/${post.id}/${post.cover}`,caption:post.caption,share_to_feed:'true'},token);
   if(!c.id)throw Error('Meta não retornou container');
   await save({status:'processing',containerId:c.id});
  }catch(e){if(e.definitive)await save({status:'failed',message:e.message});throw e;}
 }
 const status=await call('GET',`/${state.containerId}`,{fields:'status_code'},token);
 if(status.status_code==='PUBLISHED'){
  const recent=await call('GET',`/${user.id}/media`,{fields:'id,caption,timestamp',limit:'25'},token);
  const norm=s=>(s||'').replace(/\s+/g,' ').trim();
  const found=recent.data?.find(m=>norm(m.caption)===norm(post.caption));
  if(!found)throw Error('Reel publicado; confirmação de media pendente, sem nova publicação');
  return done(found.id,found.timestamp?new Date(found.timestamp).toISOString():now.toISOString());
 }
 if(['ERROR','EXPIRED'].includes(status.status_code)){await save({status:'failed',message:status.status_code});throw Error('Container Reel '+status.status_code);}
 if(status.status_code!=='FINISHED'){await log(env,'Reel em processamento: '+post.id);return false;}
 if(state.status==='publishing')throw Error('Publicação do Reel incerta; aguardar confirmação sem repetir');
 if(!publishAllowed){await save({status:'ready'});await log(env,'Reel pronto para 09:00: '+post.id);return false;}
 await save({status:'publishing'});
 try{
  const result=await call('POST',`/${user.id}/media_publish`,{creation_id:state.containerId},token);
  if(!result.id)throw Error('Resposta de publicação sem media id');
  return await done(result.id);
 }catch(e){if(e.definitive)await save({status:'ready',message:e.message});throw e;}
}
export function reelPreparationTime(now){return now.getUTCHours()===12&&[50,55].includes(now.getUTCMinutes());}
