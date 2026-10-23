import {z} from 'zod';
import {searchEntries,buildBrief,categories,collections} from './catalog.mjs';

/** Build the same tools for the browser registry and isolated contract tests.
 * The actions object reads current React state rather than capturing initial state.
 */
export function createBrowserTools(entries,actions){
 const empty=z.object({}).strict();
 const id=z.object({id:z.string().min(1).max(100)}).strict();
 const search=z.object({query:z.string().max(200).default(''),category:z.enum(categories).optional(),collection:z.enum(collections).optional(),kind:z.enum(['library','collection','demo','ecosystem']).optional(),status:z.enum(['reviewed','reference','unverified']).optional(),limit:z.number().int().min(1).max(50).default(12)}).strict();
 const lookup=id=>entries.find(e=>e.id===id);
 const tool=(name,description,schema,readOnlyHint,run)=>({
  name,description,inputSchema:z.toJSONSchema(schema),annotations:{readOnlyHint,untrustedContentHint:true},
  async execute(input,options={}){
   if(options.signal?.aborted)return {error:'cancelled',message:'The action was cancelled.'};
   const parsed=schema.safeParse(input);
   if(!parsed.success)return {error:'invalid_input',issues:parsed.error.issues.map(e=>({path:e.path,message:e.message}))};
   try{return await run(parsed.data)}catch{return {error:'action_failed',message:'The action could not be completed. Read the current state before retrying.'}}
  }
 });
 return [
  tool('atlas_search_resources','Search the catalogue with fuzzy matching and optional filters. Returns records without changing the visible page.',search,true,args=>({resources:searchEntries(entries,args)})),
  tool('atlas_get_resource','Read the full record, upstream URL, evidence and use-case notes for one catalogue ID.',id,true,({id})=>lookup(id)||{error:'not_found',id}),
  tool('atlas_get_state','Read the current visible filters, shortlist and open resource. Shortlists belong to this browser.',empty,true,()=>actions.getState()),
  tool('atlas_open_resource','Open a resource detail dialog in this page. Does not navigate to an external website.',id,false,({id})=>{if(!lookup(id))return {error:'not_found',id};actions.openResource(lookup(id));return {opened:id,state:actions.getState()}}),
  tool('atlas_set_shortlist','Add or remove a resource from the visible browser-local shortlist. Repeating the same action is safe.',id.extend({saved:z.boolean()}).strict(),false,({id,saved})=>{if(!lookup(id))return {error:'not_found',id};actions.setShortlist(id,saved);return {state:actions.getState()}}),
  tool('atlas_get_build_brief','Return a brief for specified resource IDs, or the current shortlist when IDs are omitted. Does not copy code, install packages or access external sites.',z.object({ids:z.array(z.string().min(1)).min(1).max(50).optional()}).strict(),true,({ids})=>{const selected=ids??actions.getState().shortlist;const missing=selected.filter(id=>!lookup(id));if(missing.length)return {error:'not_found',ids:missing};return {ids:selected,brief:buildBrief(entries.filter(e=>selected.includes(e.id)))}})
 ];
}

/** Registration is atomic: abort removes any tools registered before a failure. */
export async function registerBrowserTools(registry,tools,controller){
 if(typeof registry?.registerTool!=='function')return 'unsupported';
 try{
  for(const tool of tools){controller.signal.throwIfAborted();await registry.registerTool(tool,{signal:controller.signal})}
  controller.signal.throwIfAborted();return 'ready';
 }catch{controller.abort();return 'error'}
}
