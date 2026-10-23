import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {validateEntries} from '../scripts/schema.mjs';
export function loadEntries(){const entries=JSON.parse(readFileSync(fileURLToPath(new URL('../catalog/entries.json',import.meta.url)),'utf8'));const errors=validateEntries(entries);if(errors.length)throw new Error(errors.join('\n'));return entries as Array<{id:string;title:string;kind:string;category:string;url:string;summary:string;tags:string[];collections:string[];useCases:string[];status:string;integrationNotes:string;license:string;lastReviewedAt:string|null}>}
export function loadJson(name:'policy'|'sources'){return JSON.parse(readFileSync(new URL(`../catalog/${name}.json`,import.meta.url),'utf8'))}
