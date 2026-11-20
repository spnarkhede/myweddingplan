/* ---------- helpers ---------- */
const allItems=()=>{const out=[];T.workstreams.forEach(w=>{w.sections.forEach(s=>s.items.forEach(i=>out.push({...i,ws:w.id,pick:s.pick})));(S.custom[w.id]||[]).forEach(i=>out.push({...i,ws:w.id,custom:1}))});return out};
const isDone=i=>i.opts?!!S.pick[i.id]:!!S.done[i.id];
const wsItems=w=>allItems().filter(i=>i.ws===w.id);
const prog=list=>{const n=list.length,d=list.filter(isDone).length;return{n,d,p:n?Math.round(d/n*100):0}};
const wsOf=id=>T.workstreams.find(w=>w.id===id);
const itemRow=(i,opts={})=>{const late=i.due&&!isDone(i)&&days(i.due)<0;
if(i.opts){const sel=S.pick[i.id];return `<li><div class="tx" style="padding:10px 0"><span class="tt"><b>${esc(i.t)}</b></span>${sel?`<span class="chip tag">Chosen</span>`:""}<div class="opts" data-pick="${esc(i.id)}">${i.opts.map(o=>`<button type="button" aria-pressed="${sel===o}" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div></div></li>`}
return `<li><label><input type="checkbox" data-id="${esc(i.id)}" ${S.done[i.id]?"checked":""}><span class="box"></span><span class="tx"><span class="tt">${esc(i.t)}</span>${i.tag?`<span class="chip tag">${esc(i.tag)}</span>`:""}${i.due?`<span class="chip ${late?"late":"due"}">${late?"Overdue ":""}${fd(i.due)}</span>`:""}${opts.ws?`<span class="chip ws">${esc(wsOf(i.ws).title)}</span>`:""}${i.d?`<small>${esc(i.d)}</small>`:""}${i.status?`<span class="stat" data-sid="${esc(i.id)}">${STS.map(x=>`<button type="button" data-st="${x}" aria-pressed="${stOf(i)===x}">${x}</button>`).join("")}${stAt(i)&&stOf(i)!=="Not requested"?`<em>${stOf(i)} on ${fd(stAt(i))}</em>`:""}</span>`:""}</span></label>${i.custom?`<button class="del" type="button" data-del="${esc(i.id)}" data-ws="${esc(i.ws)}" aria-label="Delete task">&times;</button>`:""}</li>`};
