import {readFileSync} from 'node:fs';
import {validateEntries} from './schema.mjs';
const entries=JSON.parse(readFileSync(new URL('../catalog/entries.json',import.meta.url),'utf8'));
const errors=validateEntries(entries);if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`Validated ${entries.length} resource entries.`);
