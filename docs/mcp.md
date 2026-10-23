# MCP access

MCP is an agent protocol served over Streamable HTTP (or local stdio). This is not the experimental browser WebMCP API. Both the site and the MCP service use the same Git-backed catalogue.

## Local HTTP

Run `npm run mcp`, then point a native MCP client at `http://127.0.0.1:3001/mcp`. The server is stateless and supports POST with JSON responses; GET/DELETE return 405 intentionally. This endpoint only exists while the separate MCP process is running. Run `npm run dev` separately for the website.

## Local stdio

Use an absolute working directory in your client's configuration, or invoke:

```json
{"mcpServers":{"interface-atlas":{"command":"node","args":["--import","tsx","/absolute/path/interface-atlas/server/stdio.ts"],"cwd":"/absolute/path/interface-atlas"}}}
```

Client configuration conventions differ. `npm run mcp:stdio` also runs the local service.

## Remote deployment

Deploy the Node MCP process independently of the TanStack website, or route `/mcp` to it behind your HTTPS reverse proxy. Set HOST=0.0.0.0 and ATLAS_MCP_TOKEN; pass `Authorization: Bearer <token>` from a client that supports custom headers. The process refuses non-loopback binding without a token. Use TLS at the proxy and apply host validation/rate limits there. Browser Origin requests are rejected unless they exactly match ATLAS_ALLOWED_ORIGIN; browser CORS/preflight is not provided in v0.1.

This v0.1 uses static bearer auth, not OAuth discovery. Clients that require OAuth need an OAuth gateway/implementation before connection. No hosting, OAuth setup or ChatGPT connector registration is included in this ZIP.

## Tools

- search_resources: AND search, category/kind/review filters and limit (1–50).
- get_resource: complete record including source/evidence.
- get_build_brief: selected IDs plus default stack guidance.
- get_discovery_sources: starting points for an agent with separate browsing tools.
- validate_proposal: dry-run shape validation; no writes.

Resources: atlas://catalog, atlas://policy. Prompt: weekly_discovery.
The service reads JSON from disk per call. The website imports JSON at build time, so restart/rebuild/redeploy it after merged updates. Neither process auto-pulls Git.

Tests: `npm run test:mcp` for stdio. With the HTTP server running: `TEST_MCP_HTTP=http://127.0.0.1:3001/mcp npm run test:mcp`.
