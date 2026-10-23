import {mkdir,copyFile,writeFile,access} from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));const name=process.argv[2];
if(!name||!/^[-a-z0-9]+$/.test(name)){console.error('Usage: npm run new-project -- my-project');process.exit(1)}
const target=path.resolve(root,'..',name);try{await access(target);throw new Error('Destination already exists; choose a new name.')}catch(e){if(e.code!=='ENOENT')throw e}
await mkdir(path.join(target,'src/routes'),{recursive:true});
for(const f of ['vite.config.ts','tsconfig.json','src/router.tsx','.gitignore'])await copyFile(path.join(root,f),path.join(target,f));
await copyFile(path.join(root,'starters/tanstack-start/__root.tsx'),path.join(target,'src/routes/__root.tsx'));
await copyFile(path.join(root,'starters/tanstack-start/index.tsx'),path.join(target,'src/routes/index.tsx'));
await copyFile(path.join(root,'starters/tanstack-start/styles.css'),path.join(target,'src/styles.css'));
const {default:base}=await import('../package.json',{with:{type:'json'}});
const deps=Object.fromEntries(['@tanstack/react-start','@tanstack/react-router','react','react-dom'].map(k=>[k,base.dependencies[k]]));
const dev=Object.fromEntries(['vite','@vitejs/plugin-react','typescript','@types/react','@types/react-dom','@types/node'].map(k=>[k,base.devDependencies[k]]));
await writeFile(path.join(target,'package.json'),JSON.stringify({name,private:true,version:'0.1.0',type:'module',engines:base.engines,scripts:{dev:'vite',build:'vite build',typecheck:'tsc --noEmit'},dependencies:deps,devDependencies:dev},null,2));
await writeFile(path.join(target,'AGENTS.md'),'Default: TanStack Start v1, React, TypeScript. Consult Interface Atlas for upstream components. Do not copy the catalogue into this app. Add dependencies only when needed. Document any change of stack.');
console.log(`Created ${target}. Run npm install, npm run dev. No catalogue or MCP dependencies were copied.`);
