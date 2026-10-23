import {readFileSync} from 'node:fs';
const entries=JSON.parse(readFileSync(new URL('../catalog/entries.json',import.meta.url),'utf8'));
const stale=entries.filter(e=>!e.lastReviewedAt||(Date.now()-Date.parse(e.lastReviewedAt)>30*86400000));
console.log(`# Weekly discovery brief\n\nRead AGENTS.md and docs/weekly-discovery.md. Investigate up to 10 candidates and add at most 5.\n\n## Review queue\n${stale.map(e=>`- ${e.id}: ${e.url} (${e.status})`).join('\n')||'- No entries older than 30 days.'}\n\n## Sources\n${readFileSync(new URL('../catalog/sources.json',import.meta.url),'utf8')}`);
