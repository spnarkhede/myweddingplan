/* ---------- load ---------- */
const getJSON=async p=>{try{const r=await fetch(p,{cache:"no-store"});if(!r.ok)return null;return await r.json()}catch(e){return null}};
(async()=>{
const [tasks,fileState]=await Promise.all([getJSON("tasks.json"),getJSON("state.json")]);
T0=tasks;T=tasks;
if(!T){document.getElementById("v-home").innerHTML='<div class="ap-wrap"><p class="note3">The task list could not load. Reload the page.</p></div>';setChip("Offline");return}
let st=fileState&&typeof fileState==="object"?fileState:null;
let local=null;try{local=JSON.parse(localStorage.getItem(LS)||"null")}catch(e){}
let pend=null;try{pend=JSON.parse(sessionStorage.getItem(SS)||"null")}catch(e){}
[local,pend].forEach(x=>{if(x&&(!st||(x.updated||0)>(st.updated||0)))st=x});
if(st)S={...S,...st};
for(const k of ["done","pick","notes","custom","cert","status","statusAt","project"])if(!S[k]||typeof S[k]!=="object")S[k]={};
applyDates();
cert=initCert(S.cert,d=>{S.cert=d;save()});
route();
setChip("Ready");
if(pend)save();
})();
if(window.claude&&claude.use){claude.use("artifact").then(a=>{art=a;if(!a){canSave=false;setChip("Saved on this device")}}).catch(()=>{art=null;canSave=false})}else{art=null;canSave=false}
