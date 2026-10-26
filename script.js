const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const names=Object.keys(S);
const fill=(sel,arr)=>sel.innerHTML=arr.map(v=>`<option>${v}</option>`).join('');
const fmt=n=>'₹'+Math.round(n).toLocaleString('en-IN');
const dists=s=>DATA[s]?Object.keys(DATA[s].districts):[S[s].c+' (Capital)'];
const dist=(s,d)=>DATA[s]?DATA[s].districts[d]:null;
let tab='places';

// Explorer
const st=$('#state'),di=$('#district');fill(st,names);
function loadDistricts(){fill(di,dists(st.value));render()}
function render(){
  const s=S[st.value],d=dist(st.value,di.value);
  $('#pTitle').textContent=d?`${di.value}, ${st.value}`:st.value;
  $('#pTag').textContent=`Capital: ${s.c} · ${s.u?'Union Territory':'State'}`;
  const none='Detailed history and museum notes for this region are coming soon.';
  const items={places:[...s.p,...(d?d.places.filter(x=>!s.p.includes(x)):[])],time:['Best time to visit: '+s.b],exp:[s.e],moments:d?d.moments:[none],museums:d?d.museums:[none]}[tab];
  $('#list').innerHTML=items.map(x=>`<li>${x}</li>`).join('');
}
$('#q').addEventListener('input',e=>{const v=e.target.value.trim().toLowerCase(),m=names.filter(n=>n.toLowerCase().includes(v)||S[n].c.toLowerCase().includes(v));if(m.length){fill(st,m);loadDistricts()}});
st.onchange=loadDistricts;di.onchange=render;
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');tab=b.dataset.t;render()});

// Cards
$('#cards').innerHTML=names.map((n,i)=>`<button class="dc" data-s="${n}" style="background:linear-gradient(to top,rgba(8,14,22,.92) 12%,transparent 75%),linear-gradient(145deg,hsl(${(i*37)%360} 35% 30%),#0b1420)"><small>${S[n].u?'Union Territory':'State'} · ${S[n].c.split(' (')[0]}</small><h3>${n}</h3><p>Best: ${S[n].b}</p></button>`).join('');
$$('.dc').forEach(c=>c.onclick=()=>{st.value=c.dataset.s;loadDistricts();$('#explore').scrollIntoView()});

// Booking
const bs=$('#bState'),bd=$('#bDistrict'),f=$('#bookForm');fill(bs,names);
function loadB(){fill(bd,dists(bs.value));est()}
bs.onchange=loadB;bd.onchange=est;
$('#bookThis').onclick=()=>{bs.value=st.value;loadB();bd.value=di.value;est();$('#book').scrollIntoView()};
$$('[data-pk]').forEach(a=>a.onclick=()=>{$('#bPk').value=a.dataset.pk;est()});
f.in.min=f.out.min=new Date().toISOString().slice(0,10);
const mult={Standard:1,Premium:1.6,Luxury:2.5};
function nights(){const a=new Date(f.in.value),b=new Date(f.out.value);return f.in.value&&f.out.value?Math.round((b-a)/864e5):0}
function est(){const n=nights(),d=dist(bs.value,bd.value),p=d?d.p:3000;$('#est').textContent=fmt(n>0?p*n*(+f.pax.value||1)*mult[$('#bPk').value]:0)}
['in','out','pax'].forEach(k=>f[k].addEventListener('input',est));$('#bPk').onchange=est;
f.addEventListener('submit',e=>{
  e.preventDefault();let ok=true;
  f.querySelectorAll('input[required]').forEach(i=>{const bad=!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));i.classList.toggle('bad',bad);if(bad)ok=false});
  const msg=$('#msg');
  if(!ok){msg.textContent='Please fill in all fields correctly.';return}
  if(nights()<1){msg.textContent='Check-out must be after check-in.';return}
  msg.textContent='';
  const id='HOH'+Date.now().toString().slice(-6),dest=`${bd.value}, ${bs.value}`;
  const text=`Hello Hill of Haven! Booking ${id}: ${f.name.value}, ${f.pax.value} traveller(s), ${dest}, ${f.in.value} to ${f.out.value}, ${$('#bPk').value} package, est. ${$('#est').textContent}. Phone: ${f.phone.value}`;
  $('#mb').textContent=`Thank you, ${f.name.value}. Your request ${id} for ${dest} (${nights()} nights) is noted. Estimated total: ${$('#est').textContent}.`;
  $('#wa').href='https://wa.me/910000000000?text='+encodeURIComponent(text); // replace with your WhatsApp number
  saveB({id,dest,name:f.name.value,pax:f.pax.value,in:f.in.value,out:f.out.value,pk:$('#bPk').value,total:$('#est').textContent});
  $('#modal').classList.add('on');f.reset();loadB();if(user){f.name.value=user.name;f.email.value=user.email}
});
$('#mc').onclick=()=>$('#modal').classList.remove('on');
$('#modal').onclick=e=>{if(e.target.id==='modal')e.target.classList.remove('on')};

// My bookings (saved in this browser only)
const getB=()=>{try{return JSON.parse(localStorage.getItem('hoh_bookings'))||[]}catch(_){return[]}};
const putB=a=>{try{localStorage.setItem('hoh_bookings',JSON.stringify(a))}catch(_){}};
function saveB(b){putB([b,...getB()]);showB()}
function showB(){const a=getB();$('#mine').innerHTML=a.length?a.map(b=>`<li><span><b>${b.id}</b> · ${b.dest}<br>${b.in} → ${b.out} · ${b.pax} traveller(s) · ${b.pk} · ${b.total}</span><button data-id="${b.id}">Cancel</button></li>`).join(''):'<li class="none">No bookings yet.</li>';
 $$('#mine button').forEach(x=>x.onclick=()=>{putB(getB().filter(b=>b.id!==x.dataset.id));showB()})}
showB();
// Login state (demo)
let user=null;try{user=JSON.parse(localStorage.getItem('hoh_user'))}catch(_){}
if(user){const l=$('#loginLink');l.textContent='Hi, '+user.name.split(' ')[0]+' · Logout';l.href='#';
 l.onclick=e=>{e.preventDefault();try{localStorage.removeItem('hoh_user')}catch(_){}location.reload()};
 f.name.value=user.name;f.email.value=user.email}

// UI
const nav=$('#nav');addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>40));
$('#burger').onclick=()=>{const o=$('#menu').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
$$('#menu a').forEach(a=>a.addEventListener('click',()=>$('#menu').classList.remove('open')));
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.15});
$$('.reveal').forEach(r=>io.observe(r));
$('#yr').textContent=new Date().getFullYear();
loadDistricts();loadB();
