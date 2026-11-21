/* ---------- event countdown in the header ---------- */
// Counts down to the selected event (wedding by default) using the dates and times
// shared with the invitation maker. The round button switches units; clicking the
// countdown moves to the next event and plays its scene (see celebrations.js).
const loveBtn=document.getElementById("loveTimer"),loveTxt=document.getElementById("tmTxt"),loveLab=document.getElementById("tmLab"),unitBtn=document.getElementById("tmUnit");
const p2=n=>String(n).padStart(2,"0");
const addMon=(d,n)=>{const x=new Date(d.getTime()),day=x.getDate();x.setDate(1);x.setMonth(x.getMonth()+n);x.setDate(Math.min(day,new Date(x.getFullYear(),x.getMonth()+1,0).getDate()));return x};
const UNITS=[["all","Years to seconds"],["years","Total years"],["months","Total months"],["weeks","Total weeks"],["days","Total days"],["hours","Total hours"],["minutes","Total minutes"],["seconds","Total seconds"]];
const SEQ=["engagement","haldi","sangeet","wedding","love"];
let unitIx=0,seqIx=-1;try{unitIx=Math.max(0,UNITS.findIndex(u=>u[0]===localStorage.getItem("mwpTimerUnit")))}catch(e){}
const curEvent=()=>seqIx<0||SEQ[seqIx]==="love"?"wedding":SEQ[seqIx];
function eventAt(id){if(!T||typeof evList!=="function")return null;const e=evList().find(x=>x.id===id);if(!e||!e.date)return null;
const m=/^(\d{1,2}):(\d{2})$/.exec(e.time||"");const [y,mo,d]=e.date.split("-").map(Number);return new Date(y,mo-1,d,m?+m[1]:0,m?+m[2]:0,0)}
function spanParts(a,b){let m=0;while(addMon(a,m+1)<=b)m++;let r=Math.floor((b-addMon(a,m))/1000);
const dd=Math.floor(r/86400);r-=dd*86400;const h=Math.floor(r/3600);r-=h*3600;const mi=Math.floor(r/60);
return {mo:m,rest:b-addMon(a,m),Y:Math.floor(m/12),M:m%12,W:Math.floor(dd/7),D:dd%7,H:h,m:mi,S:r-mi*60}}
const nIN=(v,d=0)=>v.toLocaleString("en-IN",{minimumFractionDigits:d,maximumFractionDigits:d});
function fmtSpan(a,b){const ms=b-a,p=spanParts(a,b),u=UNITS[unitIx][0];
switch(u){case "years":return nIN(ms/(365.2425*864e5),4)+" years";
case "months":return nIN(p.mo+p.rest/(30.436875*864e5),3)+" months";
case "weeks":return nIN(ms/(7*864e5),2)+" weeks";case "days":return nIN(ms/864e5,2)+" days";
case "hours":return nIN(Math.floor(ms/36e5))+" hours";case "minutes":return nIN(Math.floor(ms/6e4))+" minutes";
case "seconds":return nIN(Math.floor(ms/1e3))+" seconds";
default:return `${p2(p.Y)}Y:${p2(p.M)}M:${p2(p.W)}W:${p2(p.D)}D:${p2(p.H)}H:${p2(p.m)}M:${p2(p.S)}S`}}
function tickTimer(){if(document.hidden)return;const id=curEvent(),ev=(typeof evList==="function"&&T?evList():[]).find(x=>x.id===id)||{t:"Wedding"},at=eventAt(id),now=new Date();
const name=ev.t||"Wedding",next=SEQ[(seqIx+1)%SEQ.length],nextName=next==="love"?"a surprise":((typeof evList==="function"&&T?evList():[]).find(x=>x.id===next)||{t:next}).t;
if(!at){loveLab.textContent=name+(seqIx>=0&&SEQ[seqIx]==="love"?" ♥":"");loveTxt.textContent=id==="wedding"?(unitIx?"Add the wedding date":"00Y:00M:00W:00D:00H:00M:00S"):"Date to be set";
loveBtn.title=`${name}: add the date on the Overview. Click for ${nextName}.`;loveBtn.setAttribute("aria-label",loveBtn.title);return}
const past=now>at;loveLab.textContent=(past?"since ":"to ")+name+(seqIx>=0&&SEQ[seqIx]==="love"?" ♥":"");
loveTxt.textContent=(past&&!unitIx?"+":"")+fmtSpan(past?at:now,past?now:at);
loveBtn.title=`${past?"Time since":"Time to"} ${name}. Click for ${nextName}.`;
if(!loveBtn.dataset.s||now.getSeconds()===0){loveBtn.dataset.s=1;loveBtn.setAttribute("aria-label",`${loveLab.textContent}: ${loveTxt.textContent}. Click for ${nextName}.`)}}
function setUnitLabel(){const [k,l]=UNITS[unitIx],n=UNITS[(unitIx+1)%UNITS.length][1];unitBtn.title=`Showing: ${l}. Click for ${n.toLowerCase()}.`;unitBtn.setAttribute("aria-label",unitBtn.title)}
unitBtn.addEventListener("click",e=>{e.stopPropagation();unitIx=(unitIx+1)%UNITS.length;try{localStorage.setItem("mwpTimerUnit",UNITS[unitIx][0])}catch(x){}
unitBtn.classList.remove("spin");void unitBtn.offsetWidth;unitBtn.classList.add("spin");setUnitLabel();tickTimer()});
loveBtn.addEventListener("click",e=>{e.stopPropagation();seqIx=(seqIx+1)%SEQ.length;playScene(SEQ[seqIx]);loveBtn.dataset.s="";tickTimer()});
setUnitLabel();tickTimer();setInterval(tickTimer,1000);document.addEventListener("visibilitychange",tickTimer);

/* header height drives the sticky offset of the certificate tabs and the scenes */
(()=>{const ab=document.querySelector(".ab");if(!ab)return;const set=()=>document.documentElement.style.setProperty("--abh",ab.offsetHeight+"px");set();if(window.ResizeObserver)new ResizeObserver(set).observe(ab);else addEventListener("resize",set)})();
