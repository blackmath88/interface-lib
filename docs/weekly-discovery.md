# Weekly discovery workflow

This ZIP does not activate a recurring task. It supplies the repeatable workflow for a browsing/coding agent with access to the eventual GitHub repository.

## Agent task

Read AGENTS.md, catalog/policy.json and catalog/sources.json. Run `npm run review:brief`. Review stale entries (30 days), resolve unverified links, then explore official sources and their curated links. Investigate at most 10 new candidates; propose at most 5 with a clear design use case. Prefer original maintainers over aggregator pages.

For each candidate, check duplicates by canonical URL and project identity. Read official documentation and repository/licence if available. Record the exact URL and a concise evidence note, and set lastReviewedAt to the date you actually reviewed it. If implementation, browser support or licence is unknown, say so. A live demo is not permission to copy its code. Do not upgrade to reviewed based on an HTTP 200 response alone.

Use the existing record shape. Keep summaries concise and integrationNotes useful to a future build agent. Optional fields use null, never made-up values. Add sources to sources.json when they offer repeatable discovery value. New categories require updating categories in src/lib/catalog.mjs.

Create a branch, edit the index, run validation/tests/build/typecheck/MCP integration, and open a PR. Include additions, changed/dead URLs, evidence, unanswered questions and any taxonomy changes. Preserve stable IDs and explain removals. Do not merge automatically.

## Scheduling later

Configure the agent scheduler of your choice to run this brief weekly against the GitHub repo, e.g. Monday 09:00 Europe/Zurich. The agent needs browsing plus branch/PR rights. Keep model credentials in your scheduler's secrets store. CI in this ZIP validates submitted changes; it is not a research agent and does not discover resources by itself.

## Prompt

“Update Interface Atlas using docs/weekly-discovery.md. Review stale entries, discover at most five useful new resources, and open a PR with evidence. Index originals; do not copy implementations. Use TanStack Start v1 as the default project lens, while keeping alternatives discoverable.”
