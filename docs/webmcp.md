# Browser WebMCP

The catalogue registers six tools using the current `document.modelContext.registerTool` API. It runs entirely on GitHub Pages; no MCP server or API key is needed. Tools are available only while the document is open in a compatible browser/agent. This is different from remote MCP over HTTP.

- atlas_search_resources: read-only fuzzy catalogue search.
- atlas_get_resource: read-only full record and evidence.
- atlas_get_state: read-only current filters, shortlist and opened resource.
- atlas_open_resource: opens an in-page detail dialog, without external navigation.
- atlas_set_shortlist: idempotently adds/removes a resource in the browser-local shortlist.
- atlas_get_build_brief: returns a brief for IDs or the current shortlist.

Inputs are validated at runtime. Unknown IDs and malformed inputs return structured errors. Shortlist and dialog mutations use React's synchronous commit so the next state read reflects the visible interface. Registration uses an AbortSignal for cleanup and removes partial registrations on error. Unsupported browsers retain the ordinary UI and JSON export. No polyfill pretends to provide native WebMCP support.

The existing Node MCP server is optional legacy access for clients that need stdio/HTTP; the page no longer presents it as the primary integration.

## Browser acceptance check (required before deploying this feature)

In a permitted WebMCP-capable browser, open a preview of this branch. Confirm six registered tools using the browser's tool-discovery interface. Call atlas_search_resources with query "glass". Call atlas_set_shortlist with {"id":"motion","saved":true}, read atlas_get_state and verify the visible shortlist. Remove it again. Call atlas_open_resource with an unknown ID and confirm not_found without a dialog change. Navigate away and confirm lifecycle cleanup.

Unit tests exercise contracts and a mock registry; they do not establish native browser interoperability. Browser verification remains pending in this environment.

Reference: https://developer.chrome.com/docs/ai/webmcp/imperative-api
