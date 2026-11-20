/* ---------- router ---------- */
function route(){if(!T)return;const h=(location.hash||"#home").slice(1);let v="home";
if(h.startsWith("ws-"))v="ws";else if(h==="cert"||h==="invites"||h==="name"||h==="letters"||h==="docs")v=h;
document.querySelectorAll(".view").forEach(m=>m.hidden=m.id!=="v-"+v);
document.querySelectorAll(".ab-nav a").forEach(a=>a.setAttribute("aria-current",a.dataset.v===v||(v==="ws"&&false)?"page":"false"));
if(v==="home")home();else if(v==="ws")wsView(h.slice(3));else if(v==="invites")invitesView();else if(v==="docs")docsView();else if(v==="name")nameView();else if(v==="letters")lettersView();else if(v==="cert"&&cert)requestAnimationFrame(()=>cert.refresh());
document.getElementById("footNote").textContent=STANDALONE?"Your progress saves in this browser. Use Export backup to keep a copy or move it to another device.":"Ticks, picks, notes, your own tasks and certificate details save with this page.";
window.scrollTo(0,0)}
window.addEventListener("hashchange",route);
