import assert from 'node:assert/strict';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const client=new Client({name:'atlas-test',version:'1.0.0'});
const transport=process.env.TEST_MCP_HTTP?new StreamableHTTPClientTransport(new URL(process.env.TEST_MCP_HTTP)):new StdioClientTransport({command:process.execPath,args:['--import','tsx','server/stdio.ts']});
await client.connect(transport);
try{
 const tools=await client.listTools();assert.equal(tools.tools.length,5);
 const r=await client.callTool({name:'search_resources',arguments:{query:'glass'}});assert.ok(JSON.stringify(r).includes('webgpu-glass'));
 const missing=await client.callTool({name:'get_resource',arguments:{id:'missing'}});assert.equal(missing.isError,true);
 const brief=await client.callTool({name:'get_build_brief',arguments:{ids:['motion']}});assert.ok(JSON.stringify(brief).includes('TanStack'));
 const proposal=await client.callTool({name:'validate_proposal',arguments:{entry:{id:'bad'}}});assert.ok(JSON.stringify(proposal).includes('required'));
 const resources=await client.listResources();assert.equal(resources.resources.length,2);
 const catalogue=await client.readResource({uri:'atlas://catalog'});assert.ok(JSON.stringify(catalogue).includes('horizontal-tiles'));
 const prompts=await client.listPrompts();assert.equal(prompts.prompts.length,1);
 console.log('MCP integration passed: initialize, tools, search, lookup error, brief, validation, resources, prompts.');
}finally{await client.close()}
