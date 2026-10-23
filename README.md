# Interface Atlas · v0.1

A discovery index for expressive web interfaces. Browse it visually or query it through MCP. The code, demos and documentation stay with their original authors.

## Start

Node 22.12+ (Node 24 is also supported).

```sh
npm ci
npm run dev
# Another terminal:
npm run mcp
```

Website: http://localhost:3000. MCP: http://127.0.0.1:3001/mcp.

## Included

- TanStack Start v1 + React + TypeScript website.
- 12 initial references spanning React, Three.js, animation, materials and UI foundations.
- Shared search logic, category/type/review filters, resource detail dialogs.
- Browser-local shortlist and exportable agent briefs (not shared across devices).
- Streamable HTTP and stdio MCP server: five tools, two resources and one weekly-discovery prompt.
- JSON catalogue, evidence and review states; source registry; schema validation; GitHub CI.
- Clean downstream-project generator using the same TanStack foundation.

The card artwork is original CSS category illustration, not a screenshot of the linked resource. No upstream implementation code, images or libraries are vendored. External fonts are optional; system fonts are the fallback.

## Create a new build

```sh
npm run new-project -- my-next-project
cd ../my-next-project
npm install
npm run dev
```

This creates a separate sibling folder without the catalogue or MCP dependencies. Use a shortlist brief to guide component selection from upstream. Default stack is TanStack Start v1; document a use-case reason if another stack fits better.

## Extend

Edit catalog/entries.json; see AGENTS.md. Add discovery sources to catalog/sources.json. No database or CMS is needed. All changes remain reviewable in Git. Reviewed means documentation was inspected, not a browser/code/licence audit. Unknown licences remain `not-checked`.

```sh
npm run validate
npm test
npm run build
npm run typecheck
npm run test:mcp
npm run review:brief
```

Run build before typecheck on a fresh checkout so TanStack generates its route tree. The lockfile is the reproducibility baseline. Review dependency updates on a branch.

## Weekly agent updates

See docs/weekly-discovery.md for a bounded research prompt, evidence requirements and PR workflow. No weekly task is activated by unpacking this ZIP. GitHub CI validates changes; scheduling and the browsing agent are configured separately after choosing the repository/provider.

## Deployment and agent connection

See docs/mcp.md. This is a source ZIP, not a hosted service. Build the web app with `npm run build` and choose the TanStack deployment adapter appropriate to your host. Deploy the Node MCP service separately or behind the same origin. The MCP endpoint is real protocol support, not a plain REST endpoint labelled MCP. It does not autonomously browse, download code, write Git or install components.

## Sources

Seed evidence is in each catalogue record. Framework/server implementation references:
- https://tanstack.com/start/latest/docs/framework/react/build-from-scratch
- https://ts.sdk.modelcontextprotocol.io/server
- https://docs.pmnd.rs/

Third-party resource licences remain with their owners. Review the exact upstream licence before copying code or assets. No project-wide open-source licence has been chosen for this private first build.
