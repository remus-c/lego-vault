#!/usr/bin/env node
/**
 * Zero-dependency LEGO Vault smoke tests.
 *
 * Run from repo root:
 *   node scripts/smoke-test.mjs
 *
 * These inspect local source without network access, Supabase credentials,
 * authentication, or browser installation. They are NOT visual/device tests.
 */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');
let checks=0;
function check(label,fn){
 try{fn();checks++;process.stdout.write('  ✓ '+label+'\n')}
 catch(e){console.error('  ✗ '+label+'\n    '+e.message);process.exitCode=1}
}
const html=read('index.html');
const startup=html.match(/<script>\s*'use strict';([\s\S]*?)<\/script>/)?.[1];
const setLiteral=html.match(/const DEFAULT_SETS=(\[[^\n]+\]);\n/);
const scripts=[...html.matchAll(/<script src="([^"]+)"(?:\s+[^>]*)?><\/script>/g)].map(m=>m[1]);
const sheets=[...html.matchAll(/<link rel="stylesheet" href="([^"]+)"\s*\/?>/g)].map(m=>m[1]);
const jsFiles=['theme-registry.js','set-card-theme.js','profile.js','themes-page.js','metadata.js','cloud-config.js','cloud.js','motion-engine.js'];
const assetFiles=[...jsFiles,'profile.css','themes.css','motion.css','set-card-theme.css','README.md','AGENTS.md','docs/vault-3.2-implementation-plan.md','docs/CHATGPT_PROJECT_HANDOFF.md','supabase/schema.sql'];
console.log('LEGO Vault source smoke tests');

check('Source files and Codex guidance exist',()=>{
 for(const path of assetFiles) assert.equal(existsSync(join(root,path)),true,'missing '+path);
});
check('Inline JavaScript and external script syntax',()=>{
 assert.ok(startup,'app script missing');
 new Function(startup);
 for(const file of jsFiles)new Function(read(file));
});
check('HTML references loadable resources in dependency order',()=>{
 for(const src of scripts)assert.ok(existsSync(join(root,src)),src+' does not exist');
 for(const href of sheets)assert.ok(existsSync(join(root,href)),href+' does not exist');
 const needed=['./theme-registry.js','./set-card-theme.js','./profile.js','./themes-page.js','./metadata.js','./cloud-config.js','./cloud.js','./motion-engine.js'];
 for(const n of needed)assert.ok(scripts.includes(n),n+' not referenced');
 assert.deepEqual(scripts.slice(0,2),['./theme-registry.js','./set-card-theme.js']);
 assert.ok(scripts.indexOf('./cloud-config.js')<scripts.indexOf('./cloud.js'));
});
let catalog,cardTheme;
check('Official theme registry loads and has 47 distinct themes',()=>{
 const context=vm.createContext({window:{}});
 vm.runInContext(read('theme-registry.js'),context,{timeout:1000});
 catalog=context.window.VaultThemeCatalog;
 assert.equal(catalog.count,47);
 const all=catalog.list();
 assert.equal(new Set(all.map(x=>x.name)).size,47);
 assert.equal(new Set(all.map(x=>x.id)).size,47);
 assert.equal(new Set(all.map(x=>x.world)).size,21);
 for(const theme of all)assert.match(theme.accent,/^#[\da-f]{6}$/i);
 assert.equal(catalog.verifiedFrom,'https://www.lego.com/en-dk/themes');
});
check('Card visual mapping covers official themes and preserves product categories',()=>{
 const context=vm.createContext({window:{VaultThemeCatalog:catalog}});
 vm.runInContext(read('set-card-theme.js'),context,{timeout:1000});
 cardTheme=context.window.VaultCardTheme;
 assert.equal(cardTheme.worldCount,21);
 for(const t of catalog.list()){
  const demo={id:'test-'+t.id,name:'Sample',theme:t.name};
  const data=cardTheme.skin(demo);
  assert.equal(data.official,t.name);
  assert.ok(data.world&&data.accent);
  assert.match(cardTheme.attrs(demo),/data-vault-world=/);
  assert.match(cardTheme.scene(demo),/aria-hidden/);
 }
 const examples=[
  ['72046','Gaming & Icons','Super Mario','pixel'],
  ['42155','Batman','Technic','noir'],
  ['42083','Technic & Cars','Technic','racing'],
  ['21330','Movies & TV','Ideas','gallery']
 ];
 for(const [id,theme,official,world] of examples){
  const result=cardTheme.skin({id,theme});
  assert.equal(result.official,official,'official category #'+id);
  assert.equal(result.world,world,'visual world #'+id);
 }
});
check('Seed collection integrity and unconfirmed helmet preserved',()=>{
 assert.ok(setLiteral,'base collection literal not found');
 const sets=JSON.parse(setLiteral[1]);
 const ids=sets.map(s=>s.id);
 assert.equal(new Set(ids).size,ids.length,'duplicate base set numbers');
 assert.ok(sets.filter(s=>s.status==='owned').length>=35,'unexpected owned shrinkage');
 assert.ok(sets.filter(s=>s.status==='wishlist').length>=5,'unexpected wishlist shrinkage');
 for(const id of ['75192','76240','42083','10311','72046','42155']){
  assert.equal(sets.find(s=>s.id===id)?.status,'owned','missing confirmed set '+id);
 }
 assert.equal(sets.find(s=>s.id==='75458')?.status,'unknown','helmet status must remain unconfirmed');
});
check('Local state, backup and cloud wiring are still present',()=>{
 assert.match(html,/remus-lego-vault-v3/);
 assert.match(html,/function restore\(\)/);
 assert.match(html,/function save\(\)/);
 assert.match(html,/function importBackup\(/);
 assert.match(html,/function render\(\)/);
 assert.match(html,/window\.VaultCardTheme\?\.scene/);
 assert.match(read('cloud.js'),/vault_state/);
 assert.match(read('cloud.js'),/signInWithOtp/);
 assert.match(read('supabase/schema.sql'),/enable row level security/);
 assert.match(read('supabase/schema.sql'),/auth\.uid\(\)/);
});
check('Motion and accessibility safeguards remain enabled',()=>{
 const css=read('motion.css')+'\n'+read('set-card-theme.css');
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/vault-motion="off"/);
 const engine=read('motion-engine.js');
 for(const x of ['off','gentle','cinematic'])assert.match(engine,new RegExp(x));
 assert.match(engine,/visibilitychange/);
 assert.match(read('profile.js'),/VaultCardTheme/);
});
if(process.exitCode){
 console.error('\nSome smoke tests failed. Review errors before deployment.');
}else{
 console.log('\nAll '+checks+' smoke-test groups passed. Browser/mobile/cloud QA remains separate.');
}
