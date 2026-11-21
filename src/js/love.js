/* ---------- wedding countdown and celebration ---------- */
// Counts down to the wedding date plus the wedding start time (shared with the
// invitation maker), counts up once it has passed. A click releases heart balloons.
const loveBtn=document.getElementById("loveTimer"),loveTxt=document.getElementById("tmTxt");
const p2=n=>String(n).padStart(2,"0");
const addMon=(d,n)=>{const x=new Date(d.getTime()),day=x.getDate();x.setDate(1);x.setMonth(x.getMonth()+n);x.setDate(Math.min(day,new Date(x.getFullYear(),x.getMonth()+1,0).getDate()));return x};
function weddingAt(){if(!T||!T.project||!T.project.wedding)return null;
const w=(S.inv&&S.inv.ev&&S.inv.ev.wedding)||{},def=(T.events||[]).find(e=>e.id==="wedding")||{};
const date=w.date||T.project.wedding,m=/^(\d{1,2}):(\d{2})$/.exec(w.time||def.time||"");
const [y,mo,d]=date.split("-").map(Number);return new Date(y,mo-1,d,m?+m[1]:0,m?+m[2]:0,0)}
function spanParts(a,b){let m=0;while(addMon(a,m+1)<=b)m++;let r=Math.floor((b-addMon(a,m))/1000);
const dd=Math.floor(r/86400);r-=dd*86400;const h=Math.floor(r/3600);r-=h*3600;const mi=Math.floor(r/60);
return {Y:Math.floor(m/12),M:m%12,W:Math.floor(dd/7),D:dd%7,H:h,m:mi,S:r-mi*60}}
function tickTimer(){if(document.hidden)return;const at=weddingAt(),now=new Date();
if(!at){loveTxt.textContent="00Y:00M:00W:00D:00H:00M:00S";loveBtn.title="Add the wedding date on the Overview to start the countdown. Click to celebrate.";loveBtn.setAttribute("aria-label","Wedding countdown, no date set yet. Click to celebrate.");return}
const past=now>at,p=past?spanParts(at,now):spanParts(now,at);
loveTxt.textContent=`${past?"+":""}${p2(p.Y)}Y:${p2(p.M)}M:${p2(p.W)}W:${p2(p.D)}D:${p2(p.H)}H:${p2(p.m)}M:${p2(p.S)}S`;
const words=`${p.Y} years, ${p.M} months, ${p.W} weeks, ${p.D} days, ${p.H} hours, ${p.m} minutes`;
loveBtn.title=(past?"Time since the wedding":"Time to the wedding")+". Click to celebrate.";
if(p.S===0||!loveBtn.dataset.lab){loveBtn.dataset.lab=1;loveBtn.setAttribute("aria-label",(past?"Married for ":"Wedding in ")+words+". Click to celebrate.")}}
tickTimer();setInterval(tickTimer,1000);document.addEventListener("visibilitychange",tickTimer);

const HEART="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.8 4.5 6.5 4.5c2.2 0 3.6 1.3 4.5 2.7.9-1.4 2.3-2.7 4.5-2.7 3.7 0 5.6 3.8 4.1 7.2C19.5 16.4 12 21 12 21z";
const REDS=["#e0102f","#c8102e","#ff2d55","#b0122b","#ff4d6d","#d90429"];
let loveTimerId=null,loveEl=null,loveBack=null;
function closeLove(){if(!loveEl)return;clearTimeout(loveTimerId);const el=loveEl;loveEl=null;el.classList.add("out");setTimeout(()=>el.remove(),450);document.removeEventListener("keydown",loveKey);if(loveBack&&loveBack.focus)loveBack.focus({preventScroll:true})}
const loveKey=e=>{if(e.key==="Escape"||e.key==="Enter"||e.key===" "){e.preventDefault();closeLove()}};
function celebrate(){if(loveEl){loveEl.remove();loveEl=null;clearTimeout(loveTimerId)}
loveBack=document.activeElement;const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const el=document.createElement("div");el.className="love"+(reduce?" calm":"");el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","I love you so much! So excited!");el.tabIndex=-1;
const n=reduce?14:Math.min(46,Math.max(26,Math.round(innerWidth/30)));let b="";
for(let i=0;i<n;i++){const s=26+Math.random()*46,c=REDS[i%REDS.length];
b+=`<span class="lvb" style="--x:${(Math.random()*96).toFixed(1)}vw;--s:${s.toFixed(0)}px;--d:${(4.2+Math.random()*3).toFixed(2)}s;--w:${(Math.random()*1.6).toFixed(2)}s;--sw:${(Math.random()*60-30).toFixed(0)}px;--r:${(Math.random()*30-15).toFixed(0)}deg;--y:${(10+Math.random()*80).toFixed(0)}vh"><svg viewBox="0 0 24 40" aria-hidden="true"><path d="${HEART}" fill="${c}"/><path d="M8 8.5c1.2-1.4 2.6-1.8 3.6-1.6" stroke="#fff" stroke-opacity=".55" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M12 21q-1.5 5 0 9t0 9" stroke="${c}" stroke-opacity=".7" stroke-width=".8" fill="none"/></svg></span>`}
el.innerHTML=`<div class="lbs">${b}</div><div class="lmsg"><svg class="lheart" viewBox="0.6 3.9 22.8 17.4" preserveAspectRatio="none" aria-hidden="true"><path d="${HEART}" fill="#d90429"/></svg><div class="ltx"><p class="l1">I Love you so much!</p><p class="l2">So Excited !</p></div></div>`;
document.body.appendChild(el);loveEl=el;el.addEventListener("click",closeLove);document.addEventListener("keydown",loveKey);el.focus({preventScroll:true});
loveTimerId=setTimeout(closeLove,reduce?4500:6500)}
loveBtn.addEventListener("click",celebrate);
