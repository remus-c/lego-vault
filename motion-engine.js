/* LEGO Vault 3.2 | Theme-aware ambient effects, no external art or images. */
(()=>{
'use strict';
const STORAGE='lego-vault-motion-v1',MODES=['off','gentle','cinematic'],root=document.documentElement;
const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');
const touch=window.matchMedia?.('(pointer:coarse)');
const ART={
 galaxy:['spark','stud','arc','brick','ray'],noir:['brick','arc','ray','stud'],
 garden:['petal','leaf','bokeh','stud','brick'],mechanical:['gear','stud','arc','brick','ray'],
 racing:['ray','gear','brick','spark'],pixel:['pixel','brick','stud','spark'],
 pop:['spark','pixel','brick','bokeh'],stage:['bokeh','ray','spark','brick'],
 gallery:['arc','spark','brick','bokeh'],architecture:['arc','stud','brick'],
 urban:['brick','ray','stud'],build:['stud','brick','arc'],play:['brick','stud','spark','pixel'],
 dream:['spark','arc','bokeh','brick'],magic:['spark','arc','bokeh','brick'],
 fantasy:['arc','spark','brick','leaf'],jungle:['leaf','stud','bokeh'],
 hero:['ray','arc','stud','spark'],ocean:['arc','bokeh','spark'],
 education:['stud','brick','arc'],sports:['ray','brick','spark']
};
let cached=null;try{cached=localStorage.getItem(STORAGE)}catch{}
let mode=MODES.includes(state?.preferences?.motion)?state.preferences.motion:MODES.includes(cached)?cached:'gentle';
let scene,far,near,identity='',hoverTheme='',spotlightTheme='',paused=document.hidden,pointerFrame=0,resizeTimer;
const registry=()=>window.VaultThemeCatalog;
const reduced=()=>!!media?.matches;
const active=()=>reduced()?'off':mode;
function colors(theme){
 const entry=registry()?.get(theme);
 if(entry){
  const data=registry().world(entry.name);
  return {name:entry.name,id:entry.id,world:entry.world,a:entry.accent,b:data?.[1]||'#777db9'};
 }
 const maps={
  'All themes':['play','#ffc27b','#a6a0f5'],
  'Gaming & Icons':['pixel','#ffa781','#cb98fd'],
  'Technic & Cars':['mechanical','#78c2ff','#f3948a'],
  'Art & Design':['gallery','#ffc2c2','#a7a0ff'],
  'Movies & TV':['stage','#f5acbd','#aea3ff'],
  'Other / Uncategorised':['gallery','#e9be91','#b4a2f3'],
  'Legacy / retired theme':['gallery','#d4baff','#92b9e7']
 };
 const val=maps[theme]||maps['All themes'];
 return {name:theme,id:theme||'all',world:val[0],a:val[1],b:val[2]};
}
function ambientTheme(){
 if(spotlightTheme)return spotlightTheme;
 if(hoverTheme)return hoverTheme;
 if(view==='collection'&&category!=='All themes')return category;
 if(view==='helmets')return 'Star Wars';
 if(view==='profile'){
  const skin=state.profile?.cover||'galaxy';
  return {galaxy:'Star Wars',gotham:'Batman',garden:'Botanicals',atelier:'Icons'}[skin]||'Star Wars';
 }
 if(view==='themes')return 'All themes';
 const o=view==='wishlist'?wishes():owned(),tally={};
 for(const s of o){const n=registry()?.forSet(s)||s.theme;tally[n]=(tally[n]||0)+1}
 return Object.entries(tally).sort((a,b)=>b[1]-a[1])[0]?.[0]||'All themes';
}
function srand(seed){let x=seed|0;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296}}
function hash(s){let n=2166136261;for(const c of s){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return n}
function mount(){
 if(scene)return;
 const main=document.querySelector('.main');if(!main)return;
 scene=document.createElement('div');
 scene.className='vault-atmosphere';scene.id='vaultAtmosphere';scene.setAttribute('aria-hidden','true');
 scene.innerHTML='<div class="vault-aurora a"></div><div class="vault-aurora b"></div><div class="vault-grid"></div><div class="vault-ring"></div><div class="vault-layer vault-layer-far" id="vaultFar"></div><div class="vault-layer vault-layer-near" id="vaultNear"></div>';
 main.insertBefore(scene,main.firstChild);near=document.getElementById('vaultNear');far=document.getElementById('vaultFar');
}
function makeSprites(palette){
 if(!near||!far)return;
 near.replaceChildren();far.replaceChildren();
 if(active()==='off'||paused)return;
 const small=touch?.matches||window.innerWidth<735;
 const limit=active()==='cinematic'?(small?16:29):(small?7:13);
 const types=ART[palette.world]||ART.play,random=srand(hash(palette.id+palette.world));
 const close=document.createDocumentFragment(),distant=document.createDocumentFragment();
 for(let i=0;i<limit;i++){
  const type=types[Math.floor(random()*types.length)],el=document.createElement('span');
  el.className='vault-sprite vault-sprite--'+type;
  const unit=(type==='brick'?34:type==='ray'?20:type==='gear'?38:type==='bokeh'?22:10);
  const size=Math.round(unit+random()*(type==='brick'?45:type==='gear'?30:26));
  const vars={
   '--px':(6+random()*88).toFixed(1)+'%','--py':(3+random()*89).toFixed(1)+'%',
   '--sz':size+'px','--op':(.16+random()*.38).toFixed(3),
   '--rot':Math.round(random()*360)+'deg','--dur':(8+random()*12).toFixed(1)+'s',
   '--delay':(-random()*11).toFixed(1)+'s','--dx':Math.round((random()-.5)*55)+'px',
   '--dy':Math.round((random()-.5)*75)+'px'
  };
  for(const [key,val] of Object.entries(vars))el.style.setProperty(key,val);
  (i%3===0?distant:close).append(el);
 }
 near.append(close);far.append(distant);
}
function update(force=false){
 mount();if(!scene)return;
 const p=colors(ambientTheme());
 const footprint=p.id+'/'+p.world+'/'+active()+'/'+(paused?'paused':'shown')+'/'+((touch?.matches||window.innerWidth<735)?'small':'desktop');
 root.dataset.vaultMotion=mode;root.dataset.vaultWorld=p.world;
 root.style.setProperty('--vault-a',p.a);
 root.style.setProperty('--vault-b',p.b);
 scene.dataset.vaultPreset=p.world;
 if(force||footprint!==identity){identity=footprint;makeSprites(p)}
 const button=document.getElementById('motionButton');
 if(button){
  const title=mode==='off'?'Off':mode==='gentle'?'Gentle':'Cinematic';
  button.title='Atmosphere: '+title;
  button.setAttribute('aria-label','Atmosphere effects: '+title+'. Open settings');
  const txt=button.querySelector('.motion-current');if(txt)txt.textContent=title;
 }
}
function setMode(next){
 if(!MODES.includes(next))return;
 mode=next;
 state.preferences={...(state.preferences||{}),motion:mode};
 try{localStorage.setItem(STORAGE,mode)}catch{}
 save();update(true);
}
function choice(id,title,description,art){
 return '<button class="motion-choice '+(mode===id?'selected':'')+'" type="button" data-motion-choice="'+id+'" role="radio" aria-checked="'+(mode===id)+'"><span class="motion-radio"></span><span><strong>'+title+'</strong><small>'+description+'</small></span><span class="motion-preview" aria-hidden="true">'+art+'</span></button>';
}
function openSettings(){
 modal('<div class="modal-form motion-settings"><div class="eyebrow">LEGO VAULT / ATMOSPHERE ENGINE</div><h2>Make your universe move.</h2>'+
 '<p class="motion-explain">The world around your collection adapts to LEGO themes with animated bricks, stars, petals, gears and pixels. Set the mood.</p>'+
 '<div class="motion-choices" role="radiogroup" aria-label="Motion intensity">'+
 choice('off','Off','Static background. Maximum battery savings and focus.','○')+
 choice('gentle','Gentle','A few floating bricks, soft lights and subtle particles. Recommended.','✧')+
 choice('cinematic','Cinematic','More pieces, colorful atmosphere and pointer depth.','✦')+
 '</div><p class="motion-device-note">'+(reduced()?'Your device requests reduced motion, so animated effects remain disabled.':'Animation pauses automatically when the browser tab is hidden.')+'</p>'+
 '<div class="modal-buttons"><button class="btn primary" data-action="close">Done</button></div></div>');
}
function setupButton(){
 if(document.getElementById('motionButton'))return;
 const bar=document.querySelector('.top-actions');if(!bar)return;
 const b=document.createElement('button');b.id='motionButton';b.type='button';b.className='btn';
 b.innerHTML='<span class="motion-glyph" aria-hidden="true">✧</span><span class="motion-label">Atmosphere</span><span class="motion-current"></span>';
 b.addEventListener('click',openSettings);bar.prepend(b);
}
function locate(x){
 const el=x?.closest?.('.theme-tile[data-theme-name],.set-card[data-vault-theme],.profile-feature[data-vault-theme]');
 return el?{el,name:el.dataset.themeName||el.dataset.vaultTheme}:null;
}
function setSpotlight(x){spotlightTheme=x||'';update()}
function clearSpotlight(){spotlightTheme='';update()}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-motion-choice]');
 if(b){setMode(b.dataset.motionChoice);openSettings()}
});
document.addEventListener('pointerover',e=>{
 if(touch?.matches||spotlightTheme)return;
 const x=locate(e.target);
 if(x?.name&&hoverTheme!==x.name){hoverTheme=x.name;update()}
},{passive:true});
document.addEventListener('pointerout',e=>{
 if(touch?.matches||!hoverTheme||spotlightTheme)return;
 const a=locate(e.target),b=locate(e.relatedTarget);
 if(a&&a.el!==b?.el){hoverTheme=b?.name||'';update()}
},{passive:true});
document.addEventListener('focusin',e=>{const x=locate(e.target);if(x?.name&&!spotlightTheme){hoverTheme=x.name;update()}});
document.addEventListener('focusout',e=>{if(!hoverTheme||spotlightTheme)return;hoverTheme=locate(e.relatedTarget)?.name||'';update()});
let frame=0;
document.addEventListener('pointermove',e=>{
 if(frame||active()!=='cinematic'||touch?.matches||document.hidden)return;
 const x=(e.clientX/Math.max(1,window.innerWidth)-.5)*24,y=(e.clientY/Math.max(1,window.innerHeight)-.5)*18;
 frame=requestAnimationFrame(()=>{frame=0;root.style.setProperty('--vault-x',x.toFixed(1)+'px');root.style.setProperty('--vault-y',y.toFixed(1)+'px')});
},{passive:true});
document.addEventListener('visibilitychange',()=>{paused=document.hidden;root.classList.toggle('vault-paused',paused);update(true)});
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>update(),180)},{passive:true});
media?.addEventListener?.('change',()=>update(true));
window.VaultAtmosphere={update,setSpotlight,clearSpotlight,openSettings,setMode,getMode:()=>mode,getWorld:()=>root.dataset.vaultWorld};
setupButton();update(true);
})();