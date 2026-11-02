// Progressive enhancement. All questions remain available without JavaScript.
(() => {
  'use strict';
  const image=document.querySelector('#tradeHeroBottle');
  document.querySelectorAll('[data-trade-preview]').forEach(button=>button.addEventListener('click',()=>{
    if(!image)return;
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
