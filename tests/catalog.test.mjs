import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {searchEntries,buildBrief} from '../src/lib/catalog.mjs';import {validateEntries} from '../scripts/schema.mjs';
const entries=JSON.parse(readFileSync(new URL('../catalog/entries.json',import.meta.url),'utf8'));
test('catalogue is valid',()=>assert.deepEqual(validateEntries(entries),[]));
test('AND search finds glass and applies filters',()=>{assert.equal(searchEntries(entries,{query:'WEBGPU glass'})[0].id,'webgpu-glass');assert.equal(searchEntries(entries,{query:'glass',status:'reviewed'}).length,0);assert.equal(searchEntries(entries,{kind:'demo'}).length,3)});
test('duplicate and insecure URLs are rejected',()=>{assert.ok(validateEntries([entries[0],entries[0]]).some(e=>e.includes('duplicate')));assert.ok(validateEntries([{...entries[0],url:'javascript:alert(1)'}]).some(e=>e.includes('HTTPS')))});
test('review requires evidence',()=>assert.ok(validateEntries([{...entries[0],evidence:[]}]).some(e=>e.includes('evidence'))));
test('brief contains provenance and default stack',()=>{const b=buildBrief([entries[0]]);assert.ok(b.includes('TanStack Start'));assert.ok(b.includes(entries[0].url));assert.ok(b.includes('not-checked'))});
test('malformed fields fail clearly',()=>{assert.ok(validateEntries([null]).length);assert.ok(validateEntries([{...entries[0],addedAt:'2026-02-30'}]).length)});
