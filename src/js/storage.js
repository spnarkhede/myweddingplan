/* ---------- save ---------- */
function save(){S.updated=Date.now();try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}
try{sessionStorage.setItem(SS,JSON.stringify(S))}catch(e){}
setChip("Saving");clearTimeout(timer);timer=setTimeout(flush,2500)}
async function flush(){
if(art===undefined){timer=setTimeout(flush,1500);return}
if(!art||!canSave){setChip("Saved on this device");return}
try{await art.publish({"state.json":{content:JSON.stringify(S),contentType:"application/json"}});try{sessionStorage.removeItem(SS)}catch(e){}setChip("Saved")}
catch(err){const c=err&&err.code;
if(c==="conflict"){setChip("Updating")}
else if(c==="not_writer"||c==="not_granted"||c==="capability_disabled"||c==="not_declared"||c==="consent_required"){canSave=false;setChip("Saved on this device")}
else if(c==="rate_limited"){timer=setTimeout(flush,8000)}
else{setChip("Not saved, retrying");timer=setTimeout(flush,6000)}}
}
