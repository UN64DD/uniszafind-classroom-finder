/* UniszaFind – shared data, state and behaviour for all pages */
const B={A:{n:'Block A',x:30,y:30,w:80,h:60},B:{n:'Block B',x:130,y:30,w:70,h:60},F:{n:'Block F',x:230,y:30,w:80,h:80},L:{n:'Library',x:30,y:150,w:90,h:60},C:{n:'Cafeteria',x:240,y:170,w:70,h:50}};
const T={am:[{s:'08:00',e:'10:00'},{s:'10:00',e:'12:00'}],pm:[{s:'14:00',e:'16:00'},{s:'16:00',e:'18:00'}],eve:[{s:'18:00',e:'20:00'},{s:'20:00',e:'22:00'}]};
const DAY=[...T.am,...T.pm],ALL=[...DAY,...T.eve];
const R=[
{id:'a',n:'Lecture Hall A',r:'LH-A',b:'A',f:'Ground floor',floor:0,c:'Lecture Room',m:2,img:'lecture.svg',cap:180,available:true,slots:ALL,fac:['Projector','Whiteboard','Air Conditioning','Wi-Fi','Wheelchair Access'],desc:'Main tiered lecture theatre used for large faculty classes and guest talks.'},
{id:'b',n:'Block F, Room 203',r:'F203',b:'F',f:'Level 2',floor:2,c:'Lecture Room',m:4,img:'lecture.svg',cap:60,available:true,slots:DAY,fac:['Projector','Whiteboard','Air Conditioning','Wi-Fi'],desc:'Medium lecture room on the second floor of Block F, facing the main stairwell.'},
{id:'c',n:'Computer Laboratory 2',r:'F-L2',b:'F',f:'Level 1',floor:1,c:'Laboratory',m:4,img:'lab.svg',cap:40,available:true,slots:DAY,fac:['Computers','Projector','Air Conditioning','Wi-Fi'],desc:'Computer lab with 40 workstations for practical coursework and assessments.'},
{id:'d',n:'Physics Laboratory 1',r:'B104',b:'B',f:'Level 1',floor:1,c:'Laboratory',m:3,img:'lab.svg',cap:32,available:true,slots:DAY,fac:['Lab Benches','Whiteboard','Air Conditioning','Wi-Fi'],desc:'Equipment-based physics lab with safety shower and demonstration bench.'},
{id:'e',n:'Faculty of Informatics Office',r:'F-001',b:'F',f:'Ground floor',floor:0,c:'Faculty Building',m:4,img:'office.svg',cap:12,available:false,slots:[],fac:['Air Conditioning','Wi-Fi','Reception'],desc:'Administrative office for faculty staff; not available for class booking.'},
{id:'f',n:'Main Library',r:'L-G',b:'L',f:'Ground floor',floor:0,c:'Facility',m:5,img:'facility.svg',cap:120,available:true,slots:ALL,fac:['Wi-Fi','Air Conditioning','Printing','Study Spaces'],desc:'Quiet study hall on the library ground floor with printed reference materials.'},
{id:'g',n:'Student Cafeteria',r:'C-01',b:'C',f:'Ground floor',floor:0,c:'Facility',m:3,img:'facility.svg',cap:200,available:false,slots:[],fac:['Wi-Fi','Seating'],desc:'Student dining area; used for events only by prior arrangement with management.'},
{id:'h',n:'Lecture Hall B',r:'LH-B',b:'A',f:'Level 1',floor:1,c:'Lecture Room',m:3,img:'lecture.svg',cap:120,available:true,slots:DAY,fac:['Projector','Whiteboard','Air Conditioning','Wi-Fi'],desc:'Second lecture theatre in Block A with front-row accessible seating.'},
{id:'i',n:'Computer Laboratory 1',r:'F-L1',b:'F',f:'Ground floor',floor:0,c:'Laboratory',m:4,img:'lab.svg',cap:35,available:true,slots:ALL,fac:['Computers','Projector','Air Conditioning','Wi-Fi'],desc:'Ground-floor computer lab with 35 PCs and a instructor demonstration screen.'},
{id:'j',n:'Chemistry Laboratory',r:'B204',b:'B',f:'Level 2',floor:2,c:'Laboratory',m:3,img:'lab.svg',cap:28,available:true,slots:DAY,fac:['Lab Benches','Safety Shower','Air Conditioning','Wi-Fi'],desc:'Fume-cupboard chemistry lab reserved for supervised practical sessions.'},
{id:'k',n:'Tutorial Room 3',r:'A-T3',b:'A',f:'Ground floor',floor:0,c:'Lecture Room',m:2,img:'lecture.svg',cap:45,available:true,slots:ALL,fac:['Whiteboard','Projector','Air Conditioning','Wi-Fi'],desc:'Small tutorial room near the Block A entrance for seminars and group work.'},
{id:'l',n:'Multipurpose Hall',r:'L-1',b:'L',f:'Level 1',floor:1,c:'Facility',m:5,img:'facility.svg',cap:150,available:true,slots:ALL,fac:['Projector','Whiteboard','Air Conditioning','Wi-Fi'],desc:'Flexible hall above the library used for workshops, briefings and exams.'}];
const CATS=['All','Lecture Room','Laboratory','Faculty Building','Facility'];
const CL={'Lecture Room':'Lecture Rooms','Laboratory':'Laboratories','Faculty Building':'Faculty Buildings','Facility':'Facilities'};
const DEF={q:'',cat:'All',sort:'near',sel:null,saved:[],recent:['Lecture Hall A','Block F, Room 203'],step:0,list:false,big:false,prevUrl:''};
const KEY='uniszafind';

const $=s=>document.querySelector(s);
const page=()=>document.body.dataset.page||'home';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=i=>`<svg class="i" aria-hidden="true"><use href="#i-${i}"/></svg>`;
const param=n=>new URLSearchParams(location.search).get(n);
const atRoot=()=>page()==='home';
const url=(name,params={})=>{
  const file=name==='index'?(atRoot()?'index.html':'../index.html'):((atRoot()?'pages/':'')+name+'.html');
  const q=new URLSearchParams(params).toString();
  return file+(q?'?'+q:'');
};
const asset=p=>(atRoot()?'':'../')+'assets/'+p;
const BKKEY='uniszafind-bookings';
function loadBookings(){try{const raw=localStorage.getItem(BKKEY);if(raw)return JSON.parse(raw)}catch(e){}try{const raw=sessionStorage.getItem(BKKEY);if(raw)return JSON.parse(raw)}catch(e){}return[]}
function saveBookings(list){const v=JSON.stringify(list);try{localStorage.setItem(BKKEY,v);return}catch(e){}try{sessionStorage.setItem(BKKEY,v)}catch(e){}}
function activeBookings(){return loadBookings().filter(b=>b.status!=='cancelled')}
function bookingConflict(roomId,date,start,end,ignoreId){return activeBookings().some(b=>b.id!==ignoreId&&b.roomId===roomId&&b.date===date&&start<b.end&&end>b.start)}
function todayStr(){const d=new Date();return[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function slotsText(r){return r.slots.length?r.slots.map(s=>s.s+'–'+s.e).join('  ·  '):'No bookable slots'}

function load(){
  const base=()=>JSON.parse(JSON.stringify(DEF));
  try{const raw=sessionStorage.getItem(KEY);if(raw)return Object.assign(base(),JSON.parse(raw))}catch(e){}
  try{if(window.name&&window.name.indexOf('uniszafind:')===0)return Object.assign(base(),JSON.parse(window.name.slice(11)))}catch(e){}
  return base();
}
function save(){
  const val=JSON.stringify(S);
  try{sessionStorage.setItem(KEY,val);return}catch(e){}
  try{window.name='uniszafind:'+val}catch(e){}
}
const S=load();

/* icon sprite (injected once, so every page can use <use href="#i-…">) */
document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-s" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></symbol><symbol id="i-h" viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/></symbol><symbol id="i-c" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></symbol><symbol id="i-b" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></symbol><symbol id="i-u" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></symbol><symbol id="i-r" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></symbol><symbol id="i-l" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></symbol><symbol id="i-p" viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol><symbol id="i-n" viewBox="0 0 24 24"><path d="M12 3l7 17-7-4-7 4z"/></symbol><symbol id="i-k" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol></svg>`);

let toastTimer;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('on'),1800)}
function applyBig(){document.documentElement.classList.toggle('big',!!S.big)}
function nav(p,params={}){S.prevUrl=location.href;save();location.href=url(p,params)}
function find(){const q=S.q.trim().toLowerCase();let r=R.filter(x=>(S.cat==='All'||x.c===S.cat)&&(!q||(x.n+' '+x.r+' '+B[x.b].n).toLowerCase().includes(q)));return S.sort==='name'?r.sort((a,b)=>a.n.localeCompare(b.n)):r.sort((a,b)=>a.m-b.m)}

function renderNav(){
  const t=[['index','Home','h'],['map','Explore','c'],['bookings','Bookings','k'],['saved','Saved','b'],['profile','Profile','u']];
  const on=['results','search','details'].includes(page())?'index':(page()==='booking'?'bookings':page());
  const el=$('#nav div');if(!el)return;
  el.innerHTML=t.map(([k,l,i])=>`<a href="${url(k)}" ${on===k?'aria-current="page"':''}><span class="pl">${ic(i)}</span>${l}</a>`).join('');
  $('#nav').style.display=page()==='navigate'?'none':'';
}

function chipHTML(){return `<div class="chips" role="group" aria-label="Filter by type">${CATS.map(c=>`<button class="chip" data-a="chip" data-c="${c}" aria-pressed="${S.cat===c}">${c==='All'?'All':CL[c]}</button>`).join('')}</div>`}
function renderChips(){const el=$('#chips');if(el)el.innerHTML=chipHTML()}
function rcard(r){return `<a class="card res" href="${url('details',{id:r.id})}"><div class="ib">${ic('p')}</div><div style="flex:1"><b>${esc(r.n)}</b><div class="cap mu">${esc(r.r)} · ${esc(B[r.b].n)} · ${esc(r.f)}</div><span class="pill" style="margin-top:6px">${esc(r.c)}</span></div>${ic('r')}</a>`}
function emptyHTML(){return `<div class="empty card"><div class="ib">${ic('s')}</div><b>No classrooms found</b><p class="mu">Check the spelling, or try a room number such as “F203” or a building name.</p><button class="btn s" data-a="clear">Clear search and filters</button></div>`}

function mapSVG(sel,route){
  let d=sel?door(sel):null,p=d?[[170,260],[170,125],[d.x,125],[d.x,d.y]]:null,pts=p?p.map(a=>a.join(',')).join(' '):'';
  return `<svg class="map" viewBox="0 0 340 290" role="img" aria-label="Campus map${sel?' with route to '+esc(B[sel].n):''}"><rect x="0" y="118" width="340" height="14" fill="var(--bd)"/><rect x="163" y="118" width="14" height="172" fill="var(--bd)"/>`+
  Object.entries(B).map(([k,b])=>`<g ${route?'':`data-a="bld" data-id="${k}" style="cursor:pointer" role="button" tabindex="0" aria-label="${esc(b.n)}"`}><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="8" fill="${k===sel?'var(--pr)':'var(--sf)'}" stroke="var(--in)"/><text x="${b.x+b.w/2}" y="${b.y+b.h/2+4}" text-anchor="middle" style="fill:${k===sel?'var(--onp)':'var(--tx)'}">${esc(b.n)}</text></g>`).join('')+
  (p?`<polyline points="${pts}" fill="none" stroke="var(--sc)" stroke-width="4" stroke-dasharray="1 8" stroke-linecap="round"/>`:'')+
  `<circle cx="170" cy="260" r="9" fill="var(--sc)" stroke="#fff" stroke-width="3"/><text x="170" y="282" text-anchor="middle">You are here</text>`+
  (d?`<path transform="translate(${d.x-12} ${d.y-(d.top?0:24)})" d="M12 22s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" fill="var(--er)"/>`:'')+`</svg>`
}
function door(id){const b=B[id],top=b.y<120,x=b.x+b.w/2;return{x,y:top?b.y+b.h:b.y,top}}
function steps(r){const b=B[r.b].n;return['Head north along Main Walk',`Turn at the junction toward ${b}`,`Enter ${b} and go to ${r.f.toLowerCase()}`,`${r.n} (${r.r}) is on your right`]}

/* --- page initialisers --- */
function initHome(){
  $('#logoIcon').innerHTML=ic('p');
  $('#quick').innerHTML=Object.entries(CL).map(([k,l])=>`<a class="card tile" href="${url('results',{cat:k})}"><span class="ib">${ic(k==='Facility'?'c':k==='Laboratory'?'n':k==='Lecture Room'?'h':'p')}</span>${esc(l)}</a>`).join('');
  $('#recent').innerHTML=S.recent.map(t=>`<a class="item" href="${url('results',{q:t})}"><span class="mu">${ic('k')}</span><span style="flex:1">${esc(t)}</span><span class="mu">${ic('r')}</span></a>`).join('');
  $('#nearby').innerHTML=[['F','3 min walk'],['L','5 min walk']].map(([k,m])=>`<a class="card tile" style="flex-direction:column;align-items:flex-start;padding:12px" href="${url('results',{q:B[k].n})}"><span class="ib">${ic('p')}</span>${esc(B[k].n)}<span class="cap mu">${m}</span></a>`).join('');
}

function suggestionsHTML(){
  const r=find().slice(0,5);
  return S.q&&!r.length?emptyHTML():`<h2 style="margin-top:8px">${S.q?'Suggestions':'Recent searches'}</h2>`+
    (S.q?r.map(x=>`<a class="item" href="${url('details',{id:x.id})}"><span class="mu">${ic('s')}</span><span style="flex:1"><b>${esc(x.n)}</b><span class="cap mu"> · ${esc(B[x.b].n)}</span></span></a>`).join('')
         :S.recent.map(t=>`<a class="item" href="${url('results',{q:t})}"><span class="mu">${ic('k')}</span><span style="flex:1">${esc(t)}</span></a>`).join(''))+
    (S.q?`<a class="btn p" style="margin-top:12px" href="${url('results')}">See all results</a>`:'')
}
function renderSuggestions(){const el=$('#sg');if(el)el.innerHTML=suggestionsHTML()}
function initSearch(){
  const q=$('#q');q.value=S.q;
  renderChips();renderSuggestions();
  q.focus();q.setSelectionRange(q.value.length,q.value.length);
}

function syncResultsURL(){if(page()!=='results')return;try{const p=new URLSearchParams();if(S.q)p.set('q',S.q);if(S.cat!=='All')p.set('cat',S.cat);history.replaceState(null,'',url('results')+(p.toString()?'?'+p:''))}catch(e){}}
function renderResults(){
  const r=find();
  $('#resultTitle').innerHTML=`${r.length} result${r.length===1?'':'s'}${S.q?` for “${esc(S.q)}”`:''}`;
  renderChips();
  $('#sortLabel').textContent='Sorted by '+(S.sort==='near'?'nearest':'name');
  $('#sortBtn').textContent='Sort: '+(S.sort==='near'?'Nearest':'Name');
  $('#results').innerHTML=r.length?r.map(rcard).join(''):emptyHTML();
  syncResultsURL();
}
function initResults(){
  const c=param('cat'),q=param('q');
  if(c!==null){S.cat=c;if(q===null)S.q=''}
  if(q!==null){S.q=q;if(c===null)S.cat='All'}
  save();renderResults();
}

function initDetails(){
  const id=param('id')||(S.sel&&S.sel.id);
  const r=R.find(x=>x.id===id);
  if(!r){$('#details').innerHTML=`<div class="empty card"><div class="ib">${ic('s')}</div><b>Room not found</b><p class="mu">Choose a room from search or the campus map.</p><a class="btn p" href="${url('search')}">Search rooms</a></div>`;return}
  S.sel=r;S.recent=[r.n,...S.recent.filter(x=>x!==r.n)].slice(0,3);save();
  const sv=S.saved.includes(r.id);
  $('[data-back]').setAttribute('href',url('results'));
  $('#details').innerHTML=`<img class="room-shot" src="${asset(r.img)}" alt="${esc(r.n)}">
<span class="pill" style="margin-top:16px">${esc(r.c)}</span> <span class="pill ${r.available?'status-free':'status-busy'}">${r.available?'Available to book':'Not bookable'}</span>
<h1 style="margin-top:8px">${esc(r.n)}</h1><p class="mu" style="margin:0 0 16px">Room ${esc(r.r)} · ${esc(B[r.b].n)}</p>
<p class="mu" style="margin:0 0 16px">${esc(r.desc)}</p>
<div class="grid"><div class="card" style="padding:12px"><div class="cap mu">Building</div><b>${esc(B[r.b].n)}</b></div><div class="card" style="padding:12px"><div class="cap mu">Floor</div><b>${esc(r.f)}</b></div></div>
<div class="grid" style="margin-top:12px"><div class="card" style="padding:12px"><div class="cap mu">Capacity</div><b>${r.cap} people</b></div><div class="card" style="padding:12px"><div class="cap mu">Room code</div><b>${esc(r.r)}</b></div></div>
<div class="sec"><h2>Facilities</h2><div style="display:flex;flex-wrap:wrap;gap:8px">${r.fac.map(f=>`<span class="pill">${esc(f)}</span>`).join('')}</div></div>
<div class="sec"><h2>Booking slots</h2><p class="cap mu" style="margin:0">${esc(slotsText(r))}</p></div>
<div class="sec"><h2>Direction preview</h2>${mapSVG(r.b,1)}<p class="cap mu">About ${r.m} min walk from your location</p></div>
<div style="display:grid;gap:12px;margin-top:24px">${r.available?`<button class="btn p" data-a="book" data-id="${r.id}">${ic('k')}Book Classroom</button>`:`<button class="btn p" disabled style="opacity:.5">${ic('k')}Booking unavailable</button>`}<button class="btn s" data-a="dir">${ic('n')}Get Directions</button><button class="btn s" data-a="save">${ic('b')}<span id="saveLabel">${sv?'Saved – tap to remove':'Save room'}</span></button></div>`;
}

function renderNavigate(){
  const r=S.sel,st=steps(r),done=S.step>=st.length;
  $('#navigate').innerHTML=`<h3>To ${esc(r.n)}</h3><p class="mu" style="margin:0 0 12px">From: Main Gate (your location) · <b>${r.m} min · ${r.m*70} m</b></p>${mapSVG(r.b,1)}
<div class="sec" aria-live="polite">${done?`<div class="arr">You’ve arrived at ${esc(r.n)}</div>`:''}${st.map((s,i)=>`<div class="step ${i===S.step?'on':''} ${i<S.step?'done':''}"><span class="n">${i<S.step?'✓':i+1}</span>${esc(s)}</div>`).join('')}</div>
<div style="display:grid;gap:12px;margin-top:16px">${done?'':`<button class="btn p" data-a="next">${S.step===st.length-1?'I’ve arrived':'Next step'}</button>`}<button class="btn s" data-a="end">${done?'Done':'End navigation'}</button></div>`;
}
function initNavigate(){
  const id=param('id')||(S.sel&&S.sel.id);
  const r=R.find(x=>x.id===id);
  if(!r){$('#navigate').innerHTML=`<div class="empty card"><b>No route selected</b><p class="mu">Open a room and tap Get Directions.</p><a class="btn p" href="${url('search')}">Search rooms</a></div>`;return}
  S.sel=r;save();
  $('[data-back]').setAttribute('href',url('details',{id:r.id}));
  renderNavigate();
}

function renderMap(){
  $('#mapBtn').setAttribute('aria-pressed',String(!S.list));
  $('#listBtn').setAttribute('aria-pressed',String(!!S.list));
  $('#mapContent').innerHTML=S.list
    ?Object.entries(B).map(([k,b])=>`<a class="card res" href="${url('results',{q:b.n})}"><div class="ib">${ic('p')}</div><b style="flex:1">${esc(b.n)}</b>${ic('r')}</a>`).join('')
    :mapSVG(null,0)+'<p class="cap mu">Tap a building to see its rooms.</p>';
}
function initMap(){renderMap()}

function initSaved(){
  const ids=S.saved.filter(id=>R.some(x=>x.id===id));
  $('#saved').innerHTML=ids.length?ids.map(id=>rcard(R.find(x=>x.id===id))).join(''):`<div class="empty card"><div class="ib">${ic('b')}</div><b>No saved rooms yet</b><p class="mu">Open a room and tap “Save room” to find it here quickly.</p><a class="btn p" href="${url('search')}">Search rooms</a></div>`;
}
function initProfile(){
  $('#bigBtn').setAttribute('aria-pressed',String(!!S.big));
  $('#bigState').textContent=S.big?'On':'Off';
}

/* --- classroom booking --- */
function validateBooking(r,f){
  if(!r)return 'Classroom not found.';
  if(!r.available)return 'This classroom is not available for booking.';
  if(!f.date)return 'Choose a date for the booking.';
  const d=new Date(f.date+'T00:00:00');
  if(isNaN(d.getTime())||f.date<todayStr())return 'Choose today or a future date.';
  if(!f.start||!f.end)return 'Choose both a start and an end time.';
  if(f.start>=f.end)return 'The end time must be after the start time.';
  if(!r.slots.some(s=>f.start>=s.s&&f.end<=s.e))return 'Choose a time inside the available slots listed above.';
  const n=Number(f.participants);
  if(!Number.isInteger(n)||n<1)return 'Enter at least one participant.';
  if(n>r.cap)return 'Participants exceed the capacity of '+r.cap+'.';
  if(!f.purpose||!f.purpose.trim())return 'Enter the purpose of the booking.';
  if(bookingConflict(r.id,f.date,f.start,f.end))return 'This classroom is already booked for that date and time.';
  return '';
}
function initBooking(){
  const id=param('id')||(S.sel&&S.sel.id);
  const r=R.find(x=>x.id===id);
  if(!r){$('#bookingRoom').innerHTML=`<div class="empty card"><b>Classroom not found</b><p class="mu">Choose a classroom from search to start a booking.</p><a class="btn p" href="${url('search')}">Search rooms</a></div>`;return}
  S.sel=r;save();
  $('[data-back]').setAttribute('href',url('details',{id:r.id}));
  $('#bookingRoom').innerHTML=`<img class="room-shot" src="${asset(r.img)}" alt="${esc(r.n)}"><h3 style="margin-top:12px">${esc(r.n)}</h3><p class="cap mu" style="margin:4px 0 12px">${esc(r.r)} · ${esc(B[r.b].n)} · ${esc(r.f)}</p><div style="display:flex;flex-wrap:wrap;gap:8px"><span class="pill">Capacity ${r.cap}</span><span class="pill">${esc(r.c)}</span><span class="pill ${r.available?'status-free':'status-busy'}">${r.available?'Available':'Not bookable'}</span></div><p class="cap mu" style="margin:12px 0 0">${esc(r.desc)}</p>`;
  $('#bkSlots').textContent=slotsText(r);
  $('#bkDate').min=todayStr();$('#bkDate').value=todayStr();
  $('#bkParticipants').max=r.cap;$('#bkParticipants').value=1;
  $('#bkRoom').value=r.id;
  $('#bkCancel').setAttribute('href',url('details',{id:r.id}));
}
function initBookings(){
  const list=activeBookings().sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));
  $('#bookingsBanner').innerHTML=param('new')==='1'?'<div class="arr">Booking confirmed. Your slot is saved on this device.</div>':'';
  $('#bookings').innerHTML=list.length?list.map(b=>{const r=R.find(x=>x.id===b.roomId)||{};
    return `<div class="card" style="padding:16px;margin-bottom:12px"><div class="row sp"><b>${esc(b.roomName||r.n||'Classroom')}</b><span class="pill status-free">Confirmed</span></div>
<div class="cap mu" style="margin-top:4px">${esc(b.building||'')} · ${esc(b.room||'')}</div>
<div class="row sp" style="margin-top:12px"><span class="cap mu">Date</span><b class="cap">${esc(b.date)}</b></div>
<div class="row sp" style="margin-top:4px"><span class="cap mu">Time</span><b class="cap">${esc(b.start)} – ${esc(b.end)}</b></div>
<div class="row sp" style="margin-top:4px"><span class="cap mu">Purpose</span><b class="cap" style="text-align:right">${esc(b.purpose)}</b></div>
<div class="row sp" style="margin-top:4px"><span class="cap mu">Participants</span><b class="cap">${b.participants}</b></div>
${b.remarks?`<p class="cap mu" style="margin:10px 0 0">Remarks: ${esc(b.remarks)}</p>`:''}
<button class="btn s" style="margin-top:12px" data-a="cancel" data-id="${esc(b.id)}">Cancel booking</button></div>`;
  }).join(''):`<div class="empty card"><div class="ib">${ic('k')}</div><b>No bookings yet</b><p class="mu">Open a classroom and tap “Book Classroom” to reserve a slot.</p><a class="btn p" href="${url('search')}">Find a classroom</a></div>`;
}

/* --- shared events --- */
document.addEventListener('click',e=>{
  const link=e.target.closest('a[href*=".html"]');
  if(link&&!link.hasAttribute('data-back')){S.prevUrl=location.href;save()}
  const t=e.target.closest('[data-a]');if(!t)return;
  const a=t.dataset.a,d=t.dataset;
  if(a==='back'){
    e.preventDefault();
    let u=S.prevUrl;
    try{if(u&&new URL(u,location.href).pathname===location.pathname)u=''}catch(err){u=''}
    location.href=u||t.getAttribute('href')||url('index');return;
  }
  if(a==='chip'){S.cat=d.c;save();if(page()==='search'){renderChips();renderSuggestions()}else if(page()==='results')renderResults();return}
  if(a==='sort'){S.sort=S.sort==='near'?'name':'near';save();if(page()==='results')renderResults();return}
  if(a==='bld'){S.q=B[d.id].n;S.cat='All';save();nav('results');return}
  if(a==='save'){
    const id=S.sel&&S.sel.id;if(!id)return;
    const i=S.saved.indexOf(id);if(i<0)S.saved.push(id);else S.saved.splice(i,1);save();
    const lab=$('#saveLabel');if(lab)lab.textContent=S.saved.includes(id)?'Saved – tap to remove':'Save room';
    toast(S.saved.includes(id)?'Room saved':'Removed from saved');return;
  }
  if(a==='book'){nav('booking',{id:d.id||(S.sel&&S.sel.id)});return}
  if(a==='cancel'){const list=loadBookings().map(b=>b.id===d.id?Object.assign({},b,{status:'cancelled'}):b);saveBookings(list);toast('Booking cancelled');initBookings();return}
  if(a==='dir'){if(S.sel)nav('navigate',{id:S.sel.id});return}
  if(a==='next'){S.step++;save();renderNavigate();return}
  if(a==='end'){if(S.sel)nav('details',{id:S.sel.id});return}
  if(a==='tg'){S.list=t.textContent.trim()==='List';save();renderMap();return}
  if(a==='clear'){
    S.q='';S.cat='All';save();
    if(page()==='search'){const q=$('#q');if(q)q.value='';renderChips();renderSuggestions()}
    else if(page()==='results')renderResults();
    return;
  }
  if(a==='big'){S.big=!S.big;save();applyBig();initProfile();return}
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='bookingForm')return;
  e.preventDefault();
  const f={date:$('#bkDate').value,start:$('#bkStart').value,end:$('#bkEnd').value,purpose:$('#bkPurpose').value,participants:$('#bkParticipants').value,remarks:$('#bkRemarks').value};
  const r=R.find(x=>x.id===$('#bkRoom').value);
  const err=validateBooking(r,f);
  const box=$('#bkError');
  if(err){box.textContent=err;box.classList.add('on');return}
  box.textContent='';box.classList.remove('on');
  const list=loadBookings();
  list.push({id:'bk'+Date.now(),roomId:r.id,roomName:r.n,building:B[r.b].n,room:r.r,date:f.date,start:f.start,end:f.end,purpose:f.purpose.trim(),participants:Number(f.participants),remarks:f.remarks.trim(),status:'confirmed',createdAt:new Date().toISOString()});
  saveBookings(list);
  nav('bookings',{new:'1'});
});
document.addEventListener('input',e=>{if(e.target.id==='q'){S.q=e.target.value;save();renderSuggestions()}});
document.addEventListener('keydown',e=>{
  if(e.target.id==='q'&&e.key==='Enter'){nav('results');return}
  if(e.key==='Enter'&&e.target.matches&&e.target.matches('g[data-a="bld"]'))e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));
});

/* --- boot --- */
applyBig();
renderNav();
({home:initHome,search:initSearch,results:initResults,details:initDetails,navigate:initNavigate,map:initMap,saved:initSaved,profile:initProfile,booking:initBooking,bookings:initBookings}[page()]||initHome)();
