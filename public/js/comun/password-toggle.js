const icons={show:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>',hide:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 6.1A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a15.4 15.4 0 0 1-2.1 2.8M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6c1.5 0 2.8-.4 4-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>'};

export function initializePasswordToggles(root=document){
  root.querySelectorAll('input[type="password"]').forEach((input)=>{
    if(input.closest('.password-input'))return;
    const wrapper=document.createElement('div');
    wrapper.className='password-input';
    input.parentNode.insertBefore(wrapper,input);
    wrapper.appendChild(input);
    const button=document.createElement('button');
    button.type='button';
    button.className='password-toggle';
    button.setAttribute('aria-label','Mostrar contraseña');
    button.setAttribute('aria-pressed','false');
    button.title='Mostrar contraseña';
    button.innerHTML=icons.show;
    button.addEventListener('click',()=>{
      const visible=input.type==='text';
      input.type=visible?'password':'text';
      const action=visible?'Mostrar contraseña':'Ocultar contraseña';
      button.setAttribute('aria-label',action);
      button.setAttribute('aria-pressed',String(!visible));
      button.title=action;
      button.innerHTML=visible?icons.show:icons.hide;
      input.focus({preventScroll:true});
    });
    wrapper.appendChild(button);
  });
}
