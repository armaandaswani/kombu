// Progressive enhancement. All questions remain available without JavaScript.
(() => {
  'use strict';
  const image=document.querySelector('#tradeHeroBottle');
  document.querySelectorAll('[data-trade-preview]').forEach(button=>button.addEventListener('click',()=>{
    if(!image)return;
    if(image.getAttribute('src')!==button.dataset.tradePreview){
      image.classList.add('is-swapping');
      const done=()=>requestAnimationFrame(()=>image.classList.remove('is-swapping'));
      image.addEventListener('load',done,{once:true});image.addEventListener('error',done,{once:true});
    }
    image.src=button.dataset.tradePreview;image.alt=`Kombú ${button.dataset.name}, garrafa de 500 ml`;
    document.querySelectorAll('[data-trade-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  document.querySelectorAll('[data-step-form]').forEach(form=>{
    const steps=[...form.querySelectorAll('[data-form-step]')],labels=[...form.querySelectorAll('[data-step-label]')];
    const back=form.querySelector('[data-step-back]'),next=form.querySelector('[data-step-next]'),submit=form.querySelector('[data-step-submit]');
    if(!steps.length||!back||!next||!submit)return;
    let current=0;
    const multi=()=>{
      steps[current].querySelectorAll('[data-multi-required]').forEach(group=>{
        const inputs=[...group.querySelectorAll('input[type=checkbox]')];
        inputs[0]?.setCustomValidity(inputs.some(input=>input.checked)?'':'Escolha pelo menos um perfil de público.');
      });
    };
    const show=(index,focus=false)=>{
      current=index;steps.forEach((step,i)=>step.hidden=i!==current);
      labels.forEach((label,i)=>{if(i===current)label.setAttribute('aria-current','step');else label.removeAttribute('aria-current');});
      back.hidden=current===0;next.hidden=current===steps.length-1;submit.hidden=current!==steps.length-1;
      form.querySelector('.step-announcement').textContent=`Etapa ${current+1} de ${steps.length}: ${labels[current]?.textContent||''}`;
      if(focus){const legend=steps[current].querySelector('legend');legend?.setAttribute('tabindex','-1');legend?.focus({preventScroll:true});form.scrollIntoView({behavior:'instant',block:'nearest'});}
    };
    const advance=()=>{
      multi();const invalid=[...steps[current].querySelectorAll('input,select,textarea')].find(input=>!input.disabled&&!input.checkValidity());
      if(invalid){invalid.reportValidity();invalid.focus();return;}
      if(current<steps.length-1)show(current+1,true);
    };
    form.classList.add('is-enhanced');form.noValidate=true;show(0);
    next.addEventListener('click',advance);back.addEventListener('click',()=>show(Math.max(0,current-1),true));
    form.querySelectorAll('[data-multi-required] input').forEach(input=>input.addEventListener('change',multi));
    // Enter on an early step advances instead of sending an incomplete contact.
    form.addEventListener('submit',event=>{
      if(current<steps.length-1){event.preventDefault();event.stopImmediatePropagation();advance();return;}
      const invalid=[...form.querySelectorAll('input,select,textarea')].find(input=>!input.disabled&&!input.checkValidity());
      if(invalid){event.preventDefault();event.stopImmediatePropagation();const index=steps.findIndex(step=>step.contains(invalid));if(index>=0)show(index,true);invalid.reportValidity();invalid.focus();}
    },true);
    form.addEventListener('reset',()=>show(0));
  });
})();

// Scroll motion for the trade pages. Content is fully readable without it:
// words, steps and photos only change once this script has prepared them.
(() => {
  'use strict';
  const calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

  // Partner marquee: copies the names (aria-hidden) so the loop has no gap.
  const track=document.querySelector('#proofNames');
  const fillMarquee=()=>{
    if(!track)return;
    track.querySelectorAll('[data-copy]').forEach(n=>n.remove());
    const names=[...track.children];
    if(!names.length||calm)return;
    for(let r=0;r<3;r++)names.forEach(n=>{const c=n.cloneNode(true);c.setAttribute('aria-hidden','true');c.dataset.copy='';track.appendChild(c);});
    track.style.setProperty('--n',String(names.length));
    track.classList.add('is-moving');
  };
  if(track){fillMarquee();new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&!('copy' in n.dataset))))fillMarquee();}).observe(track,{childList:true});}

  if(calm)return;

  // Statement: one span per word, lit in reading order as the paragraph scrolls by.
  const statements=[...document.querySelectorAll('[data-words]')].map(el=>{
    const words=el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label',el.textContent.trim());
    el.innerHTML=words.map(w=>`<span aria-hidden="true">${w.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))} </span>`).join('');
    el.classList.add('is-split');
    return{el,spans:[...el.children]};
  });
  const progressEls=[...document.querySelectorAll('[data-progress]')];
  const parallaxEls=[...document.querySelectorAll('[data-parallax]')];

  let ticking=false;
  const update=()=>{
    ticking=false;
    const vh=window.innerHeight;
    statements.forEach(({el,spans})=>{
      const r=el.getBoundingClientRect();
      const p=clamp((vh*0.9-r.top)/(vh*0.55+r.height*0.6),0,1);
      const lit=Math.round(p*spans.length);
      spans.forEach((s,i)=>s.classList.toggle('on',i<lit));
    });
    progressEls.forEach(el=>{
      const r=el.getBoundingClientRect();
      el.style.setProperty('--p',clamp((vh*0.7-r.top)/(r.height*0.85),0,1).toFixed(3));
    });
    parallaxEls.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.bottom<0||r.top>vh)return;
      const c=(r.top+r.height/2-vh/2)/(vh/2+r.height/2);
      el.style.setProperty('--py',(c*-28).toFixed(1)+'px');
    });
  };
  const request=()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}};
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request);
  update();

  // Catalogue and other groups arrive in a short cascade once.
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}}),{threshold:0.08});
    document.querySelectorAll('[data-stagger]').forEach(el=>{el.classList.add('is-armed');io.observe(el);});
  }
})();
