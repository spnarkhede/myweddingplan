/* ---------- project dates ---------- */
const addDays=(d,n)=>{const x=new Date(d+"T12:00:00");x.setDate(x.getDate()+n);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`};
function applyDates(){const P0=T0.project||{};const wed=(S.project&&S.project.wedding)||(/^\d{4}-/.test(P0.wedding||"")?P0.wedding:null);
const walk=v=>{if(typeof v==="string"){const m=/^W([+-]\d+)$/.exec(v);return m?(wed?addDays(wed,+m[1]):null):v}if(Array.isArray(v))return v.map(walk);if(v&&typeof v==="object"){const o={};for(const k in v)o[k]=walk(v[k]);return o}return v};
T=walk(JSON.parse(JSON.stringify(T0)));T.project=T.project||{};for(const k of ["title","wedding","fly","back"])if(S.project&&S.project[k])T.project[k]=S.project[k]}
