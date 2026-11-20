/* ---------- visa letters ---------- */
const LDEF={hName:"",hPermit:"settlement permit (Niederlassungserlaubnis)",marDate:"",marPlace:"",regOffice:"",stay:"on a long term basis",cons:"Hoechst House, 10th Floor, 193 Backbay Reclamation,\nNariman Point, Mumbai 400021",enc:"1",perm:["pr"]};
const PERM={pr:["Copy of Niederlassungserlaubnis","settlement permit (Niederlassungserlaubnis)","Settlement Permit (Niederlassungserlaubnis)"],blue:["Copy of Blaue Karte EU + Zusatzblatt","EU Blue Card (Blaue Karte EU)","EU Blue Card (Blaue Karte EU)"],work:["Copy of Aufenthaltserlaubnis zur Beschäftigung + Zusatzblatt","residence permit for employment","Residence Permit (Aufenthaltserlaubnis)"],student:["Copy of Aufenthaltserlaubnis zum Studium + Zusatzblatt","residence permit for study","Residence Permit for Study (Aufenthaltserlaubnis zum Studium)"],foreign:[null,null]};
const permList=()=>{const p=L().perm;return Array.isArray(p)?p:["pr"]};
let lcur="inv",ldl=null;
const L=()=>{S.letters=S.letters||{...LDEF};if(S.letters.hPermit==="settlement permit (Niederlassungserlaubnis, permanent residence)")S.letters.hPermit="settlement permit (Niederlassungserlaubnis)";return S.letters};
const lv=(k,c)=>{const x=(L()[k]||"").trim();return x?esc(x).replace(/\n/g,"<br>"):`<span class="lb ${c||""}"></span>`};
const lmd=()=>{const t=(L().marTime||(S.cert&&S.cert.marTime)||"").trim();return `<b>${ld("marDate")} at ${t?esc(t):`<span class="lb s"></span>`}</b>`};
const covPermit=()=>{const f=permList().find(x=>PERM[x]&&PERM[x][2]);if(!f)return lv("hPermit");return `<b>${PERM[f][2]}</b>${f==="student"?"":" for employment"}`};
const ld=k=>{const x=(L()[k]||"").trim();if(!x)return `<span class="lb s"></span>`;const[y,m,d]=x.split("-");return `${d}.${m}.${y}`};
const LTPL=[["professional","Professional"],["classic","Classic"],["simple","Simple"],["executive","Executive"],["modern","Modern"],["elegant","Elegant"]];
let ltpl="professional",llay="single";
const lhas=k=>(L()[k]||"").trim();
const encList=k=>{if(k==="inv"){const pl=permList().map(p=>PERM[p]&&PERM[p][0]).filter(Boolean).map(x=>[x,"3"]);return [["Copy of my passport","3"],...pl,["City registration (Meldebescheinigung)","3"],["Employment contract","3"],["Salary slips for the last three months","3"],["Rental contract","3"],["Health insurance confirmation","3"],["Marriage certificate","3"]]}
return [["Passport and copies","2"],["Application form, declaration and questionnaire","2"],["Marriage certificate and wedding photos","2"],["Birth certificate and school certificates","2"],["Education certificates","2"],["Health and travel insurance","3"],["My husband's invitation letter and documents","3"]]};
const LP=k=>{const inv=k==="inv";const reg=lhas("regNo")?`, certificate no. ${lv("regNo")}`:"";
return {inv,name:inv?lv("hName"):lv("wName"),init:((inv?L().hName:L().wName)||"").trim().split(/\s+/).map(w=>w[0]||"").join("").slice(0,2).toUpperCase(),
addr:inv?`${lv("hStreet")}<br>${lv("hCity")}, Germany`:lv("wAddr"),
phone:lv(inv?"hPhone":"wPhone","s"),email:lv(inv?"hEmail":"wEmail","s"),date:ld(inv?"dateH":"dateW"),
title:inv?"Invitation Letter":"Personal Covering Letter",
subject:inv?"Invitation for my wife's national visa for family reunion":"Application for a German national visa for family reunion",
body:inv?[
`I, <b>${lv("hName")}</b>, holder of Indian passport no. ${lv("hPass","s")}, live in Germany with a ${lv("hPermit")}. I work at ${lv("employer")}, ${lv("empCity","s")}, as ${lv("job")}, and live at ${lv("hStreet")}, ${lv("hCity")}.`,
`On ${lmd()}, I married <b>${lv("wName")}</b>, holder of Indian passport no. ${lv("wPass","s")}, at ${lv("marPlace","s")} according to the Hindu Marriage Act, 1955. Our marriage is registered with ${lv("regOffice")}${reg}.`,
`I warmly invite my wife to join me in Germany so that we can begin our married life together in one home.${lhas("pH")?" "+lv("pH"):""}`,
`I will bear all her expenses during her stay, including accommodation, living costs and health insurance.${lhas("flat")?` Our home offers ${lv("flat")} m² of living space, which is suitable for both of us.`:""}`,
`I assure you that my wife will respect the laws and regulations of the Federal Republic of Germany, and that after arrival she will register her address and apply for her residence permit at the local Foreigners' Authority.`,
`In view of the above, I kindly request you to grant the national visa for family reunion to my wife, <b>${lv("wName")}</b>. I will gladly provide any further information or documents.`,
`Thank you for your kind consideration.`]:[
`I, <b>${lv("wName")}</b>, holder of Indian passport no. ${lv("wPass","s")}, respectfully apply for a German national visa for family reunion to join my husband, <b>${lv("hName")}</b>, who lives and works in Germany.`,
`My husband holds a ${covPermit()} and Indian passport no. ${lv("hPass","s")}. He works at ${lv("employer")}, ${lv("empCity","s")}, as ${lv("job")}, and lives at ${lv("hStreet")}, ${lv("hCity")}. This will also be my residential address in Germany.`,
`We were married on ${lmd()} in ${lv("marPlace","s")} according to the Hindu Marriage Act, 1955, and our marriage is registered with ${lv("regOffice")}${reg}.`,
`I wish to live with my husband in Germany ${lv("stay")} and build our family life together.${lhas("pW")?" "+lv("pW"):""} My husband will be my sole sponsor and will cover all my expenses during my stay.`,
`All required documents are enclosed, and the information given is true to the best of my knowledge. I will gladly provide any further information or documents when required.`,
`In view of the above, I kindly request you to issue me the national visa for family reunion to join my husband in Germany.`],
encl:encList(k)}};
const lTo=()=>`<div class="lto"><b>To</b><br>The Consulate General of the Federal Republic of Germany<br>${lv("cons")}</div>`;
const lBody=p=>`<p class="lsub"><b>Subject:</b> ${p.subject}</p><p>Dear Sir or Madam,</p>${p.body.map(x=>`<p>${x}</p>`).join("")}`;
const lSign=p=>`<div class="lsig"><p>Yours sincerely,</p><div class="lsl"></div><div class="lsn">${p.name}</div><div class="lsc">Mobile: ${p.phone} &nbsp;|&nbsp; Email: ${p.email}</div></div>`;
const lEncInline=p=>L().enc?`<div class="lenc"><b>Enclosures</b><ol>${p.encl.map(x=>`<li>${esc(x[0])}</li>`).join("")}</ol></div>`:"";
const lEncRef=()=>L().enc?`<p class="lref">Enclosures: see the annexure on page 2.</p>`:"";
const lAnnex=p=>`<h2 class="lanx">Annexure: List of Enclosed Documents</h2><p class="lanr">Enclosed with the ${p.title.toLowerCase()} of <b>${p.name}</b>, dated ${p.date}.</p><table class="ltab"><thead><tr><th>No.</th><th>Document</th><th>Copies</th></tr></thead><tbody>${p.encl.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x[0])}</td><td>${x[1]}</td></tr>`).join("")}</tbody></table><p class="lanr">Originals of all documents are available for verification at the appointment.</p>${lSign(p)}`;
/* each design: head(p) and frame(inner,p) */
const LD={
professional:{head:p=>`<div class="lh2"><div class="lh2n">${p.name}</div><div class="lh2a">${p.addr}</div></div><div class="ldate">Date: ${p.date}</div>`,title:p=>`<h1 class="lttl"><span>${p.title}</span></h1>`,frame:x=>`<div class="lin">${x}</div>`},
classic:{head:p=>`<div class="c-h"><div class="c-n">${p.name}</div><div class="c-a">${p.addr}</div><div class="c-a">Mobile: ${p.phone} &middot; Email: ${p.email}</div></div><div class="ldate">Date: ${p.date}</div>`,title:p=>`<h1 class="c-t">${p.title}</h1>`,frame:x=>`<div class="lin">${x}</div>`},
simple:{head:p=>`<div class="s-h"><b>${p.name}</b><br>${p.addr}</div><div class="ldate">${p.date}</div>`,title:p=>`<h1 class="s-t">${p.title}</h1>`,frame:x=>`<div class="lin">${x}</div>`},
executive:{head:p=>"",title:p=>`<h1 class="e-t">${p.title}</h1>`,frame:(x,p)=>`<div class="e-wrap"><aside class="e-side"><div class="e-mono">${esc(p.init||"")}</div><div class="e-n">${p.name}</div><div class="e-l">Address</div><div class="e-v">${p.addr}</div><div class="e-l">Mobile</div><div class="e-v">${p.phone}</div><div class="e-l">Email</div><div class="e-v">${p.email}</div><div class="e-l">Date</div><div class="e-v">${p.date}</div></aside><div class="lin">${x}</div></div>`},
modern:{head:p=>"",title:p=>`<h1 class="m-t">${p.title}</h1>`,frame:(x,p)=>`<div class="m-wrap"><header class="m-h"><div><div class="m-n">${p.name}</div><div class="m-a">${p.addr}</div></div><div class="m-c">${p.phone}<br>${p.email}<br>Date: ${p.date}</div></header><div class="lin">${x}</div></div>`},
elegant:{head:p=>`<div class="g-h"><div class="g-mono">${esc(p.init||"")}</div><div class="g-n">${p.name}</div><div class="g-a">${p.addr}</div></div><div class="ldate">Date: ${p.date}</div>`,title:p=>`<h1 class="g-t">${p.title}</h1>`,frame:x=>`<div class="g-wrap"><div class="g-o"><div class="lin">${x}</div></div></div>`}};
const lPage1=(k)=>{const p=LP(k),d=LD[ltpl];return d.frame(`<div class="lfit">${d.head(p)}${d.title(p)}${lTo()}${lBody(p)}${lSign(p)}${llay==="single"?lEncInline(p):lEncRef()}</div>`,p)};
const lPage2=(k)=>{const p=LP(k),d=LD[ltpl];return d.frame(`<div class="lfit">${d.head(p)}${lAnnex(p)}</div>`,p)};
const lsheet=document.getElementById("lsheet"),lstage=document.getElementById("lstage"),lsheet2=document.getElementById("lsheet2"),lstage2=document.getElementById("lstage2"),lpg2=document.getElementById("lpg2");
const lfitOne=sh=>{const f=sh.querySelector(".lfit");if(!f)return;f.style.transform="";f.style.width="";const par=f.parentElement,cs=getComputedStyle(par);const lim=par.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);const h=f.offsetHeight;if(lim>0&&h>lim){const s=Math.max(.68,lim/h);f.style.transformOrigin="0 0";f.style.transform=`scale(${s})`;f.style.width=(100/s)+"%"}};
const lscaleOne=(st,sh)=>{const s=st.clientWidth/794;if(!s)return;sh.style.transform=`scale(${s})`;st.style.height=1123*s+"px"};
const lfit=()=>{lfitOne(lsheet);if(!lpg2.hidden)lfitOne(lsheet2)};
const lscale=()=>{lscaleOne(lstage,lsheet);if(!lpg2.hidden)lscaleOne(lstage2,lsheet2)};
const lrender=()=>{const cls="lsheet ld-"+ltpl;lsheet.className=cls;lsheet2.className=cls;lsheet.innerHTML=lPage1(lcur);lpg2.hidden=llay!=="double";lsheet2.innerHTML=llay==="double"?lPage2(lcur):"";lscale();lfit()};
new ResizeObserver(()=>{lscale();lfit()}).observe(lstage);new ResizeObserver(()=>{lscale();lfit()}).observe(lstage2);
function lettersView(){const d=L();document.querySelectorAll("#permg [data-perm]").forEach(i=>{i.checked=permList().includes(i.dataset.perm)});document.querySelectorAll("#lf [data-k]").forEach(i=>{if(i.type==="checkbox")i.checked=!!d[i.dataset.k];else i.value=d[i.dataset.k]||""});
document.getElementById("ltpl").innerHTML=LTPL.map(([k,l])=>`<button type="button" data-t="${k}" aria-pressed="${ltpl===k}">${l}</button>`).join("");
document.querySelectorAll("#llay button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.l===llay));
lrender();requestAnimationFrame(()=>{lscale();lfit()})}
document.getElementById("lf").addEventListener("input",e=>{const pm=e.target.dataset.perm;if(pm){let p=permList().filter(x=>x!==pm);if(e.target.checked)p.push(pm);const order=["pr","blue","work","student","foreign"];p.sort((a,b)=>order.indexOf(a)-order.indexOf(b));L().perm=p;const first=p.find(x=>PERM[x][1]);const known=Object.values(PERM).map(x=>x[1]).concat([LDEF.hPermit,""]);if(first&&known.includes((L().hPermit||"").trim())){L().hPermit=PERM[first][1];const hp=document.querySelector('#lf [data-k="hPermit"]');if(hp)hp.value=L().hPermit}save();lrender();return}
const k=e.target.dataset.k;if(!k)return;L()[k]=e.target.type==="checkbox"?(e.target.checked?"1":""):e.target.value;save();lrender()});
document.getElementById("v-letters").addEventListener("click",e=>{const b=e.target.closest("#ltabs button,#ltpl button,#llay button");if(!b)return;if(b.dataset.l&&b.closest("#ltabs")){lcur=b.dataset.l;document.querySelectorAll("#ltabs button").forEach(x=>x.setAttribute("aria-selected",x===b))}if(b.dataset.t)ltpl=b.dataset.t;if(b.closest("#llay"))llay=b.dataset.l;lettersView()});
const lmsg=document.getElementById("lmsg"),ldlb=document.getElementById("ldl");
if(window.claude&&claude.use){claude.use("downloads").then(d=>{ldl=d;if(!d){ldlb.hidden=true;lmsg.textContent="Download is not available in this view. Open the page in claude.ai to save the PDF."}}).catch(()=>{})}
ldlb.addEventListener("click",async()=>{if(!ldl&&!STANDALONE){lmsg.textContent="Download is not available in this view.";return}if(!window.html2canvas||!window.jspdf){lmsg.textContent="The PDF tools did not load. Reload and try again.";return}
ldlb.disabled=true;lmsg.textContent="Building the PDF";const box=document.createElement("div");box.style.cssText="position:fixed;left:-10000px;top:0";const pages=[lsheet].concat(llay==="double"?[lsheet2]:[]).map(sh=>{const c=sh.cloneNode(true);c.style.transform="none";c.removeAttribute("id");box.appendChild(c);return c});document.body.appendChild(box);
try{await (document.fonts?document.fonts.ready:Promise.resolve());const pdf=new jspdf.jsPDF({orientation:"p",unit:"pt",format:"a4"});for(let i=0;i<pages.length;i++){const cv=await html2canvas(pages[i],{scale:2,backgroundColor:"#ffffff",width:794,height:1123,windowWidth:1200});if(i)pdf.addPage();pdf.addImage(cv.toDataURL("image/jpeg",0.95),"JPEG",0,0,595.28,841.89)}
const nm=(lcur==="inv"?"Invitation letter":"Personal covering letter")+" "+LTPL.find(t=>t[0]===ltpl)[1]+(llay==="double"?" two pages":"");
await saveFile(ldl,nm+".pdf",pdf.output("blob"));lmsg.textContent="Saved. Print it on A4 and sign above your name."}
catch(err){const code=err&&err.code;lmsg.textContent=code==="declined"?"Download cancelled.":code==="rate_limited"?"A save prompt is already open.":"Could not save the PDF here. Try again in claude.ai."}finally{box.remove();ldlb.disabled=false}});
