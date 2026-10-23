import Fuse from 'fuse.js';
export const categories=['All resources','UI foundations','Layout & navigation','Motion & interaction','Materials & atmosphere','3D & scenes'];
export const collections=['Editorial','Spatial','Panels & boards','Navigation','Data visualisation'];
/** @template T extends {title:string,tags:string[],summary:string,category:string,integrationNotes:string,kind:string,status:string,collections?:string[],useCases?:string[]}
 * @param {T[]} entries
 * @param {{query?:string,category?:string,kind?:string,status?:string,collection?:string,limit?:number}} [options]
 * @returns {T[]}
 */
export function searchEntries(entries,{query='',category='',kind='',status='',collection='',limit=100}={}) {
 const filtered=entries.filter(e=>(!category||category==='All resources'||e.category===category)&&(!kind||e.kind===kind)&&(!status||e.status===status)&&(!collection||e.collections?.includes(collection)));
 if(!query.trim())return filtered.sort((a,b)=>a.title.localeCompare(b.title)).slice(0,limit);
 const fuse=new Fuse(filtered,{includeScore:true,threshold:0.32,ignoreLocation:true,keys:[{name:'title',weight:3},{name:'tags',weight:2},'summary','category','useCases','collections']});
 const terms=query.trim().split(/\s+/);
 const scores=terms.map(term=>new Map(fuse.search(term).map(r=>[r.item,r.score??1])));
 return filtered.filter(e=>scores.every(m=>m.has(e))).sort((a,b)=>scores.reduce((n,m)=>n+(m.get(a)??1)-(m.get(b)??1),0)||a.title.localeCompare(b.title)).slice(0,limit);
}
export function buildBrief(entries){return `Project baseline: TanStack Start v1 + React + TypeScript. Change the stack when justified by the use case.\nThis is an index, not a source-code mirror. Inspect upstream code and licences before reuse.\n\n${entries.map(e=>`${e.title} (${e.status})\n${e.url}\n${e.integrationNotes}\nUseful for: ${(e.useCases||[]).join("; ")}\nRelated resources: ${(e.relatedIds||[]).join(", ")}\nLicence: ${e.license}`).join('\n\n')}`}
