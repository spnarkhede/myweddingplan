/* ---------- detailed plan (overview) ---------- */
// Builds a day-by-day plan from the project dates, the event dates and times
// (shared with the invitation maker through S.inv.ev), the timeline and every dated task.
const PO={tasks:true,done:false,past:false};
const WD=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const fdl=d=>{const x=new Date(d+"T12:00:00");return `${WD[x.getDay()]} ${x.getDate()} ${MON[x.getMonth()]} ${x.getFullYear()}`};
const rel=d=>{const n=days(d);return n===0?"Today":n===1?"Tomorrow":n===-1?"Yesterday":n>0?`in ${n} days`:`${-n} days ago`};
const tmin=t=>{const m=/^(\d{1,2}):(\d{2})$/.exec(t||"");return m?+m[1]*60+ +m[2]:null};
const tfmt=m=>{m=((m%1440)+1440)%1440;return `${String(m/60|0).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`};
const evStore=()=>{S.inv=S.inv||{};S.inv.ev=S.inv.ev||{};return S.inv.ev};
const evList=()=>(T.events||[]).map(e=>{const x=(S.inv&&S.inv.ev&&S.inv.ev[e.id])||{};return {id:e.id,t:e.t,mr:e.mr,date:x.date||e.date||null,time:x.time||e.time||"",venue:x.venue||"",addr:x.addr||""}});

function planEntries(){const P=T.project,out=[];
if(P.fly)out.push({d:P.fly,k:"travel",t:"Travel out",key:1});
if(P.back)out.push({d:P.back,k:"travel",t:"Travel back",key:1});
(T.timeline||[]).filter(e=>e.d&&!e.role).forEach(e=>out.push({d:e.d,k:"mile",t:e.l,to:e.to,ws:e.ws,key:e.key}));
evList().filter(e=>e.date).forEach(e=>{const m=tmin(e.time),wed=e.id==="wedding";
out.push({d:e.date,k:"event",t:wed&&m!=null?`${e.t} (muhurta)`:e.t,mr:e.mr,tm:m,venue:e.venue,addr:e.addr,key:1});
if(m!=null){if(wed)out.push({d:e.date,k:"sug",t:"Bride and groom start getting ready",tm:m-180});
out.push({d:e.date,k:"sug",t:e.venue?`Leave for ${e.venue}`:"Leave for the venue",tm:m-60});
if(wed)out.push({d:e.date,k:"sug",t:"Family and priest at the venue, rituals begin",tm:m-30})}});
if(PO.tasks)allItems().filter(i=>i.due&&(PO.done||!isDone(i))).forEach(i=>out.push({d:i.due,k:"task",item:i}));
return out}

function planPhases(){const P=T.project,ev=evList().filter(e=>e.date).map(e=>e.date).sort();const ph=[{from:"0000",l:"Before you travel"}];
if(P.fly)ph.push({from:P.fly,l:"After you arrive"});
const first=ev[0]||P.wedding;if(first)ph.push({from:first,l:"Celebrations"});
if(P.wedding)ph.push({from:addDays(P.wedding,1),l:"After the wedding"});
if(P.back)ph.push({from:addDays(P.back,1),l:"After you travel back"});
return ph.sort((a,b)=>a.from<b.from?-1:a.from>b.from?1:0)}

function peRow(e){if(e.k==="task")return itemRow(e.item,{ws:1});
const lab={travel:"Travel",mile:"Milestone",event:"Event",sug:"Suggested"}[e.k];
const t=e.ws?`<a href="#ws-${esc(e.ws)}">${esc(e.t)}</a>`:esc(e.t);
const sub=[e.mr?`<span class="mr">${esc(e.mr)}</span>`:"",e.to?`until ${fd(e.to)}`:"",e.venue?esc(e.venue):"",e.addr?esc(e.addr):""].filter(Boolean).join(" &middot; ");
return `<li class="pe pe-${e.k}"><span class="pt">${e.tm!=null?tfmt(e.tm):""}</span><span class="tx"><span class="tt">${t}</span><span class="chip pk">${lab}</span>${sub?`<small>${sub}</small>`:""}</span></li>`}

function renderPlan(){const el=document.getElementById("plan");if(!el)return;const P=T.project;
const tools=`<div class="ptools"><div class="opts" id="popt">${[["tasks","Tasks"],["done","Completed"],["past","Earlier days"]].map(([k,l])=>`<button type="button" data-po="${k}" aria-pressed="${PO[k]}">${l}</button>`).join("")}</div><div class="acts" style="margin:0"><button class="btn" type="button" id="pPrint">Print plan</button><button class="btn" type="button" id="pIcs">Download calendar (.ics)</button><span class="muted" id="pMsg"></span></div></div>`;
if(!P.wedding){el.innerHTML=`<div class="note3">Add your wedding date in <a href="#home" data-open-pf>Edit project details</a> at the top. The plan then fills in your travel days, events and every task, day by day.</div>`;return}
const unsched=evList().filter(e=>!e.date||!e.time);
const ents=planEntries(),t0=today();
const overdue=ents.filter(e=>e.k==="task"&&e.d<t0&&!isDone(e.item));
const by={};ents.forEach(e=>{if(!PO.past&&e.d<t0)return;(by[e.d]=by[e.d]||[]).push(e)});
const hidden=PO.past?0:new Set(ents.filter(e=>e.d<t0).map(e=>e.d)).size;
const ord={travel:0,mile:1,event:2,sug:2,task:4};
const sortE=(a,b)=>{const ta=a.tm!=null?a.tm:-1,tb=b.tm!=null?b.tm:-1;if(ord[a.k]===4||ord[b.k]===4)return ord[a.k]-ord[b.k];if(ta!==tb)return ta-tb;return ord[a.k]-ord[b.k]};
const ph=planPhases();const phOf=d=>{let l=ph[0].l;for(const p of ph)if(d>=p.from)l=p.l;return l};
let html=tools;
if(unsched.length)html+=`<div class="note3"><b>Still to schedule:</b> ${unsched.map(e=>`${esc(e.t)} (${!e.date?"date":"time"})`).join(", ")}. Add them under <a href="#home" data-open-pf>Edit project details</a>. Times you add here also fill the wedding invitations.</div>`;
if(overdue.length)html+=`<section class="pphase"><h3 class="pph late">Overdue <span>${overdue.length}</span></h3><ul class="ck2 pul">${overdue.map(e=>itemRow(e.item,{ws:1})).join("")}</ul></section>`;
if(hidden)html+=`<p class="muted">${hidden} earlier ${hidden===1?"day is":"days are"} hidden. <button type="button" class="linkb" data-po="past">Show them</button></p>`;
let cur=null;const dates=Object.keys(by).sort();
if(!dates.length)html+=`<p class="empty">Nothing planned from today on. Turn on Earlier days or Completed to see more.</p>`;
dates.forEach(d=>{const p=phOf(d);if(p!==cur){if(cur!==null)html+=`</section>`;cur=p;html+=`<section class="pphase"><h3 class="pph">${esc(p)}</h3>`}
const list=by[d].sort(sortE);const key=list.some(e=>e.key&&e.k!=="mile")||d===P.wedding;
const tasks=list.filter(e=>e.k==="task"),rest=list.filter(e=>e.k!=="task");
html+=`<div class="pday${d===t0?" today":""}${key?" key":""}${d<t0?" past":""}" id="pd-${d}"><div class="pdate"><b>${fdl(d)}</b><span>${rel(d)}${d===P.wedding?" &middot; wedding day":""}</span></div><div>${rest.length?`<ul class="pel">${rest.map(peRow).join("")}</ul>`:""}${tasks.length?`<ul class="ck2 pul">${tasks.map(peRow).join("")}</ul>`:""}</div></div>`});
if(cur!==null)html+=`</section>`;
const und=T.workstreams.map(w=>({w,n:wsItems(w).filter(i=>!i.due&&!isDone(i)).length})).filter(x=>x.n);
if(PO.tasks&&und.length)html+=`<section class="pphase"><h3 class="pph">Not tied to a date <span>${und.reduce((a,x)=>a+x.n,0)} open</span></h3><div class="pund">${und.map(x=>`<a href="#ws-${esc(x.w.id)}" style="--c:${x.w.color}"><b>${x.n}</b> ${esc(x.w.title)}</a>`).join("")}</div></section>`;
el.innerHTML=html}

function renderEvForm(){const box=document.getElementById("pfEv");if(!box)return;const L=evList();
if(!box.dataset.built){box.innerHTML=`<p class="pevh">Events: date, start time and venue</p>`+L.map(e=>`<div class="pevr"><span class="pevn">${esc(e.t)}</span><label class="f">Date<input type="date" data-pe="${e.id}" data-f="date"></label><label class="f">Start time<input type="time" data-pe="${e.id}" data-f="time"></label><label class="f">Venue<input data-pe="${e.id}" data-f="venue"></label></div>`).join("");box.dataset.built=1}
box.querySelectorAll("[data-pe]").forEach(i=>{if(document.activeElement===i)return;const e=L.find(x=>x.id===i.dataset.pe);i.value=(e&&e[i.dataset.f])||""})}

document.addEventListener("input",e=>{const i=e.target.closest("[data-pe]");if(!i)return;const st=evStore();const o=st[i.dataset.pe]=st[i.dataset.pe]||{};o[i.dataset.f]=i.value;if(!i.value)delete o[i.dataset.f];save();renderPlan()});
document.addEventListener("click",e=>{
const o=e.target.closest("[data-po]");if(o){PO[o.dataset.po]=!PO[o.dataset.po];renderPlan();return}
const jp=e.target.closest("[data-jump-plan]");if(jp){e.preventDefault();document.getElementById("planSec").scrollIntoView({behavior:"smooth"});return}
const op=e.target.closest("[data-open-pf]");if(op){e.preventDefault();const d=document.querySelector("details.pset");if(d){d.open=true;d.scrollIntoView({behavior:"smooth",block:"start"});const f=d.querySelector('[data-p="wedding"]');if(f&&!T.project.wedding)setTimeout(()=>f.focus(),300)}return}
if(e.target.closest("#pPrint")){document.body.classList.add("print-plan");window.print();return}
if(e.target.closest("#pIcs"))planIcs()});
window.addEventListener("afterprint",()=>document.body.classList.remove("print-plan"));

async function planIcs(){const msg=document.getElementById("pMsg");const P=T.project;
if(typeof bdl!=="undefined"&&!bdl&&!STANDALONE){msg.textContent="Download is not available in this view.";return}
const x=s=>String(s||"").replace(/\\/g,"\\\\").replace(/[,;]/g,m=>"\\"+m).replace(/\n/g,"\\n");
const dd=d=>d.replace(/-/g,"");const stamp=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");
const ev=[];const allDay=(d,t,desc)=>ev.push(["DTSTART;VALUE=DATE:"+dd(d),"DTEND;VALUE=DATE:"+dd(addDays(d,1)),"SUMMARY:"+x(t),desc?"DESCRIPTION:"+x(desc):""]);
if(P.fly)allDay(P.fly,"Travel out");if(P.back)allDay(P.back,"Travel back");
(T.timeline||[]).filter(e=>e.d&&!e.role).forEach(e=>e.to?ev.push(["DTSTART;VALUE=DATE:"+dd(e.d),"DTEND;VALUE=DATE:"+dd(addDays(e.to,1)),"SUMMARY:"+x(e.l)]):allDay(e.d,e.l));
evList().filter(e=>e.date).forEach(e=>{const m=tmin(e.time);const loc=[e.venue,e.addr].filter(Boolean).join(", ");
if(m==null)return allDay(e.date,e.t,loc);const s=dd(e.date)+"T"+tfmt(m).replace(":","")+"00",end=m+180;
const ed=(end>=1440?dd(addDays(e.date,1)):dd(e.date))+"T"+tfmt(end).replace(":","")+"00";
ev.push(["DTSTART:"+s,"DTEND:"+ed,"SUMMARY:"+x(e.t),loc?"LOCATION:"+x(loc):""])});
const body=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//My Wedding Plan//EN","CALSCALE:GREGORIAN",...ev.flatMap((v,n)=>["BEGIN:VEVENT","UID:mwp-"+n+"-"+stamp+"@my-wedding-plan","DTSTAMP:"+stamp,...v.filter(Boolean),"END:VEVENT"]),"END:VCALENDAR"].join("\r\n");
try{await saveFile(typeof bdl!=="undefined"?bdl:null,"my-wedding-plan.ics",new Blob([body],{type:"text/calendar"}));msg.textContent=`Calendar saved with ${ev.length} entries.`}catch(err){msg.textContent=err&&err.code==="declined"?"Cancelled.":"Could not save the calendar here."}}
