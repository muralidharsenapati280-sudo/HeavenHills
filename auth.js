const $=s=>document.querySelector(s);let mode='in';
const set=m=>{mode=m;$('#aTitle').textContent=m==='in'?'Welcome back':'Create account';$('#nameWrap').style.display=m==='in'?'none':'grid';$('#sub').textContent=m==='in'?'New here?':'Already a member?';$('#swap').textContent=m==='in'?'Sign up':'Log in';$('#go').textContent=m==='in'?'Log in':'Sign up'};
$('#swap').onclick=()=>set(mode==='in'?'up':'in');set('in');
$('#auth').addEventListener('submit',e=>{
  e.preventDefault();const f=e.target,m=$('#am');
  const okE=/^\S+@\S+\.\S+$/.test(f.email.value),okP=f.pass.value.length>=6,okN=mode==='in'||f.name.value.trim();
  if(!okE||!okP||!okN){m.textContent=!okN?'Please enter your name.':!okE?'Enter a valid email.':'Password must be at least 6 characters.';return}
  // DEMO ONLY: no server check. Connect a real backend for real accounts.
  try{localStorage.setItem('hoh_user',JSON.stringify({name:f.name.value.trim()||f.email.value.split('@')[0],email:f.email.value}))}catch(_){}
  location.href='index.html#explore';
});
