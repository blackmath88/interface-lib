import {categories} from '../src/lib/catalog.mjs';
const allowed=['id','title','kind','category','url','summary','tags','integrationNotes','status','addedAt','lastReviewedAt','evidence','license','sourceUrl','upstreamMcp'];
const url=value=>{try{return new URL(value).protocol==='https:'}catch{return false}};
const date=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
export function validateEntries(entries){
 const errors=[];if(!Array.isArray(entries))return ['Catalogue must be an array'];const ids=new Set(),urls=new Set();
 for(const [i,e] of entries.entries()){
  if(!e||typeof e!=='object'||Array.isArray(e)){errors.push(`Entry ${i} must be an object`);continue}
  const add=m=>errors.push(`${e.id||i}: ${m}`);
  for(const k of Object.keys(e))if(!allowed.includes(k))add(`unknown field ${k}`);
  for(const k of ['id','title','summary','integrationNotes','license'])if(typeof e[k]!=='string'||!e[k].trim())add(`${k} is required`);
  if(typeof e.id!=='string'||!/^[-a-z0-9]+$/.test(e.id))add('id must be a lowercase slug');
  if(ids.has(e.id))add('duplicate id');ids.add(e.id);
  if(!url(e.url))add('url must be HTTPS');else {const u=new URL(e.url);u.hash='';u.search='';const canonical=u.href.replace(/\/$/,'');if(urls.has(canonical))add('duplicate canonical URL');urls.add(canonical)}
  if(!['library','collection','demo','ecosystem'].includes(e.kind))add('invalid kind');
  if(!categories.slice(1).includes(e.category))add('invalid category');
  if(!['reviewed','reference','unverified'].includes(e.status))add('invalid status');
  if(!Array.isArray(e.tags)||!e.tags.length||e.tags.some(t=>typeof t!=='string'||!t.trim()))add('tags must be nonempty strings');
  if(!date(e.addedAt))add('invalid addedAt');
  if(e.lastReviewedAt!==null&&!date(e.lastReviewedAt))add('invalid lastReviewedAt');
  if(!Array.isArray(e.evidence)||e.evidence.some(v=>!v||!url(v.url)||typeof v.note!=='string'||!v.note.trim()))add('invalid evidence');
  if(e.status==='reviewed'&&(!e.lastReviewedAt||!e.evidence?.length))add('reviewed entries require dated evidence');
  for(const k of ['sourceUrl','upstreamMcp'])if(e[k]!==null&&!url(e[k]))add(`${k} must be HTTPS or null`);
 }
 return errors;
}
