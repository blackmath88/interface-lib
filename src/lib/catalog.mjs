export const categories=['All resources','UI foundations','Layout & navigation','Motion & interaction','Materials & atmosphere','3D & scenes'];
/** @template T extends {title:string,tags:string[],summary:string,category:string,integrationNotes:string,kind:string,status:string}
 * @param {T[]} entries
 * @param {{query?:string,category?:string,kind?:string,status?:string,limit?:number}} [options]
 * @returns {T[]}
 */
export function searchEntries(entries,{query='',category='',kind='',status='',limit=100}={}) {
 const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 return entries.filter(e=>(!category||category==='All resources'||e.category===category)&&(!kind||e.kind===kind)&&(!status||e.status===status))
 .map(e=>({e,score:words.reduce((n,w)=>n+(e.title.toLowerCase().includes(w)?4:0)+(e.tags.some(t=>t.includes(w))?3:0)+(`${e.summary} ${e.category} ${e.integrationNotes}`.toLowerCase().includes(w)?1:0),0)}))
 .filter(({e})=>words.every(w=>`${e.title} ${e.tags.join(' ')} ${e.summary} ${e.category} ${e.integrationNotes}`.toLowerCase().includes(w)))
 .sort((a,b)=>b.score-a.score||a.e.title.localeCompare(b.e.title)).slice(0,limit).map(x=>x.e);
}
export function buildBrief(entries){return `Project baseline: TanStack Start v1 + React + TypeScript. Change the stack when justified by the use case.\nThis is an index, not a source-code mirror. Inspect upstream code and licences before reuse.\n\n${entries.map(e=>`${e.title} (${e.status})\n${e.url}\n${e.integrationNotes}\nLicence: ${e.license}`).join('\n\n')}`}
