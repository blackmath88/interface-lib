# Contributing resources

1. Start with an existing record in catalog/entries.json.
2. Use a stable lowercase slug and the canonical HTTPS URL.
3. Specify kind, category, tags, a short summary and practical integration notes.
4. Keep sourceUrl and upstreamMcp null unless verified. Licence remains not-checked until inspected.
5. Set status to unverified, reference or reviewed. Reviewed requires evidence and a real review date; it is not an audit badge.
6. Run npm run validate and npm test, then npm run build and npm run typecheck.
7. Open a PR explaining additions and source evidence.

Do not commit downloaded third-party components or assets. New integrations belong in downstream projects. Sources can be added in catalog/sources.json. Default-stack rules live in catalog/policy.json and AGENTS.md.
