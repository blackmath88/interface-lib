import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {createBrowserTools,registerBrowserTools} from './webmcp.mjs';
type Registry={registerTool(tool:object,options?:{signal?:AbortSignal}):void|Promise<void>};
export function useWebMcp(entries:Parameters<typeof createBrowserTools>[0],actions:Parameters<typeof createBrowserTools>[1],enabled:boolean){
 const current=useRef(actions);
 useLayoutEffect(()=>{current.current=actions});
 const [status,setStatus]=useState('checking');
 useEffect(()=>{
  if(!enabled)return;
  const controller=new AbortController();let mounted=true;
  const registry=(document as Document&{modelContext?:Registry}).modelContext;
  const tools=createBrowserTools(entries,{
   getState:()=>current.current.getState(),
   openResource:(entry:unknown)=>current.current.openResource(entry),
   setShortlist:(id:string,saved:boolean)=>current.current.setShortlist(id,saved)
  });
  void registerBrowserTools(registry,tools,controller).then(result=>{if(mounted)setStatus(result)});
  return ()=>{mounted=false;controller.abort()};
 },[enabled,entries]);
 return status;
}
