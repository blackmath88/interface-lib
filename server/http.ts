import express from 'express';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {createAtlasServer} from './mcp';
const app=express();
const host=process.env.HOST||'127.0.0.1';
const port=Number(process.env.PORT||3001);
const token=process.env.ATLAS_MCP_TOKEN;
if(!['127.0.0.1','localhost','::1'].includes(host)&&!token)throw new Error('Set ATLAS_MCP_TOKEN before exposing the MCP service beyond loopback.');
app.use(express.json({limit:'128kb'}));
app.get('/health',(_req,res)=>res.json({name:'interface-atlas',status:'ok'}));
app.use('/mcp',(req,res,next)=>{
 // Native MCP clients do not need cross-origin browser requests. Reject unsolicited browser origins.
 if(req.headers.origin&&req.headers.origin!==process.env.ATLAS_ALLOWED_ORIGIN){res.status(403).json({error:'Origin not allowed'});return}
 if(token&&req.headers.authorization!==`Bearer ${token}`){res.status(401).json({error:'Invalid bearer token'});return}
 next();
});
app.post('/mcp',async(req,res)=>{
 const server=createAtlasServer();
 const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true,enableDnsRebindingProtection:host==='127.0.0.1',allowedHosts:[`127.0.0.1:${port}`,`localhost:${port}`]});
 res.on('close',()=>{void transport.close();void server.close()});
 try{await server.connect(transport);await transport.handleRequest(req,res,req.body)}catch(error){console.error(error);if(!res.headersSent)res.status(500).json({error:'MCP request failed'})}
});
app.all('/mcp',(_req,res)=>res.status(405).set('Allow','POST').end());
app.listen(port,host,()=>console.error(`Atlas MCP: http://${host}:${port}/mcp`));
