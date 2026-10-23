import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {createAtlasServer} from './mcp';
await createAtlasServer().connect(new StdioServerTransport());
