/* ---------- views ---------- */
function home(){
const P=T.project;const all=allItems();const pr=prog(all);
const stat=(d,l)=>{if(!d)return `<div class="st"><b>?</b><span>Set the date for ${l} below</span></div>`;const n=days(d);return `<div class="st"><b>${n>0?n:n===0?"Today":"Done"}</b><span>${n>0?"days to ":""}${l} (${fd(d)})</span></div>`};
document.getElementById("heroTitle").textContent=P.title||"My Wedding Plan";document.getElementById("heroSub").textContent=(P.fly&&P.back?`${fd(P.fly)} to ${fd(P.back)}`:"")+(P.sub?(P.fly&&P.back?", ":"")+P.sub:"");
document.querySelectorAll("#pf [data-p]").forEach(i=>{if(document.activeElement!==i)i.value=(S.project&&S.project[i.dataset.p])||(i.dataset.p==="title"?"":P[i.dataset.p])||""});
document.getElementById("stats").innerHTML=stat(P.fly,"your flight")+stat(P.wedding,"the wedding")+stat(P.back,"flying back");
document.getElementById("allFill").style.width=pr.p+"%";
document.getElementById("allCount").textContent=`${pr.d} of ${pr.n} tasks done`;
document.getElementById("timeline").innerHTML=T.timeline.filter(e=>e.d).map(e=>{const past=days(e.to||e.d)<0;const lab=e.ws?`<a href="#ws-${e.ws}">${esc(e.l)}</a>`:esc(e.l);return `<li class="${e.key?"key":""} ${past?"past":""}"><div class="d">${fd(e.d)}${e.to?" to "+fd(e.to):""}</div><div class="t">${lab}</div></li>`}).join("");
const next=all.filter(i=>!isDone(i)&&i.due).sort((a,b)=>a.due<b.due?-1:1).slice(0,8);
document.getElementById("nextUp").innerHTML=next.length?next.map(i=>itemRow(i,{ws:1})).join(""):`<li class="empty">Nothing due. Well done.</li>`;
document.getElementById("wsGrid").innerHTML=T.workstreams.map(w=>{const p=prog(wsItems(w));return `<a class="wsc" href="#ws-${w.id}" style="--c:${w.color}"><h3>${esc(w.title)}</h3><div class="m">${esc(w.place)} &middot; ${esc(w.window)}</div><div class="pb"><i style="width:${p.p}%"></i></div><div class="n">${p.n?`${p.d} of ${p.n} done`:"No tasks yet"}</div></a>`}).join("");
renderEvForm();renderPlan();
}
function wsView(id){const w=wsOf(id);const el=document.getElementById("v-ws");if(!w){location.hash="home";return}
const p=prog(wsItems(w));const mine=S.custom[w.id]||[];
const tool=w.tool==="letters"?`<a class="tool" href="#letters">Open the visa letters</a>`:w.tool==="cert"?`<a class="tool" href="#cert">Open the certificate maker</a>`:w.tool==="invites"?`<a class="tool" href="#invites">Open the wedding invitation maker</a>`:"";
el.innerHTML=`<section class="wsh" style="--c:${w.color}"><div class="ap-wrap"><a class="back" href="#home">Overview</a><h1>${esc(w.title)}</h1><div class="muted">${esc(w.place)} &middot; ${esc(w.window)} &middot; ${p.d} of ${p.n} done</div>${w.note?`<div class="note3">${esc(w.note)}</div>`:""}${tool}</div></section>
<div class="ap-wrap"><div class="secs">${w.sections.map(s=>{const sp=prog(s.items);return `<div class="sec2"><h3>${esc(s.title)}${s.items.length?`<span>${sp.d}/${sp.n}</span>`:""}</h3>${s.info?`<div class="faq sinfo">${s.info.map(f=>`<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>`:""}${s.items.length?`<ul class="ck2">${s.items.map(i=>itemRow(i)).join("")}</ul>`:`<p class="empty">Nothing here yet. Send me your list or add tasks below.</p>`}</div>`}).join("")}
<div class="sec2"><h3>My tasks${mine.length?`<span>${prog(mine).d}/${mine.length}</span>`:""}</h3>${mine.length?`<ul class="ck2">${mine.map(i=>itemRow({...i,ws:w.id,custom:1})).join("")}</ul>`:`<p class="empty">Add your own tasks here.</p>`}
<form class="addf" data-add="${w.id}"><input name="t" placeholder="New task" aria-label="New task" required><input name="due" type="date" aria-label="Due date"><button class="btn pri" type="submit">Add</button></form>
<div class="notes"><h3>Notes</h3><textarea data-notes="${w.id}" aria-label="Notes" placeholder="Phone numbers, addresses, reminders">${esc(S.notes[w.id]||"")}</textarea></div></div></div></div>`}
function invites(){const C=[["#9c1458","#e0a015"],["#e0a015","#e86a1a"],["#5b2a86","#1f8f6a"],["#8e1b2a","#f6a313"]];
document.getElementById("evGrid").innerHTML=T.events.map((e,i)=>`<div class="evc" style="--a:${C[i%4][0]};--b:${C[i%4][1]}"><div class="top">${esc(e.mr)}</div><div class="bd"><h3>${esc(e.t)}</h3><div class="s">${e.date?fd(e.date)+" 2027 &middot; ":""}Waiting for details</div></div></div>`).join("")}
