/* ---------- documents page ---------- */
let dFilter="all";
function docsView(){const D=T.docs;if(!D)return;S.have=S.have||{};const el=document.getElementById("v-docs");
const all=D.cats.flatMap(c=>c.items);const n=all.length,h=all.filter(i=>S.have[i.id]).length;
const F=[["all","All"],["Groom","Groom"],["Bride","Bride"],["Witnesses","Witnesses"],["missing","Still missing"]];
el.innerHTML=`<section class="wsh" style="--c:#1f5f7a"><div class="ap-wrap"><a class="back" href="#home">Overview</a><h1>Documents</h1><p class="muted">${esc(D.intro)}</p>
<div class="meter2 dm"><div class="bar2"><i style="width:${n?Math.round(h/n*100):0}%"></i></div><b>${h} of ${n} in hand</b></div>
<div class="opts" id="dfil">${F.map(([k,l])=>`<button type="button" data-f="${k}" aria-pressed="${dFilter===k}">${l}</button>`).join("")}</div>
<nav class="dnav">${D.cats.map(c=>`<a href="#docs" data-jump="${c.id}">${esc(c.title.replace(/ \(.*\)$/,""))}</a>`).join("")}</nav></div></section>
<div class="ap-wrap">${D.cats.map(docCat).join("")}</div>`}
const DCOL={Groom:"Groom",Bride:"Bride",Both:"Both of you",Witnesses:"Witnesses"};
function docItem(i,chip){return `<li class="${S.have[i.id]?"got":""}"><label><input type="checkbox" data-have="${esc(i.id)}" ${S.have[i.id]?"checked":""}><span class="box"></span><span class="tx"><span class="tt">${esc(i.t)}</span>${chip?`<span class="chip who w-${i.who}">${esc(i.who)}</span>`:""}${i.tag?`<span class="chip tag">${esc(i.tag)}</span>`:""}${i.d?`<small>${esc(i.d)}</small>`:""}</span></label></li>`}
function docGroup(c,who){const all=c.items.filter(i=>i.who===who);if(!all.length&&(who==="Both"||who==="Witnesses"))return "";
const vis=all.filter(i=>dFilter!=="missing"||!S.have[i.id]);const got=all.filter(i=>S.have[i.id]).length;
return `<div class="dcol dc-${who}"><h3 class="dch">${DCOL[who]}<span>${all.length?got+" of "+all.length:""}</span></h3>${vis.length?`<ul class="ck2 dl2">${vis.map(i=>docItem(i,false)).join("")}</ul>`:`<p class="empty">${all.length?"All in hand.":"Nothing needed."}</p>`}</div>`}
function docCat(c){const ch=c.items.filter(i=>S.have[i.id]).length;const f=dFilter;
const cols=f==="Groom"?["Groom"]:f==="Bride"?["Bride"]:f==="Witnesses"?[]:["Groom","Bride"];
const wide=(f==="Witnesses"?["Witnesses"]:f==="all"||f==="missing"?["Both","Witnesses"]:["Both"]).map(w=>docGroup(c,w)).filter(Boolean);
const body=(cols.length?`<div class="dgrid${cols.length===1?" one":""}">${cols.map(w=>docGroup(c,w)).join("")}</div>`:"")+wide.join("");
return `<section class="dcat" id="dc-${c.id}"><h2 class="ap-h2">${esc(c.title)} <span class="dcount">${ch}/${c.items.length}</span></h2>${c.note?`<p class="muted" style="max-width:80ch">${esc(c.note)}</p>`:""}${body||'<p class="empty">Nothing to show with this filter.</p>'}</section>`}
document.addEventListener("change",e=>{const c=e.target.closest("input[data-have]");if(!c)return;S.have=S.have||{};if(c.checked)S.have[c.dataset.have]=1;else delete S.have[c.dataset.have];save();const y=window.scrollY;docsView();window.scrollTo(0,y)});
document.addEventListener("click",e=>{const f=e.target.closest("#dfil button");if(f){dFilter=f.dataset.f;const y=window.scrollY;docsView();window.scrollTo(0,y);return}
const j=e.target.closest("[data-jump]");if(j){e.preventDefault();const t=document.getElementById("dc-"+j.dataset.jump);if(t)t.scrollIntoView({behavior:"smooth"})}});
