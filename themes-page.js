/* LEGO Vault 3.2: verified LEGO.com theme index and independent theme browsing UX. */
(()=>{
'use strict';
const THEMES_SOURCE='https://www.lego.com/en-dk/themes';
let mode='all',q='';
const t=()=>window.VaultThemeCatalog;
const byName=x=>t()?.normalizeName(x)||x;
const safe=x=>escapeHTML(String(x==null?'':x));
const stats=()=>{
 const result=new Map(t().list().map(x=>[x.name,0]));
 for(const s of owned()){const n=t().forSet(s);if(result.has(n))result.set(n,result.get(n)+1)}
 return result
};
const motif=(world)=>{
 if(['galaxy','magic','dream','fantasy'].includes(world))return '✦';
 if(['garden','jungle'].includes(world))return '❀';
 if(['mechanical','racing'].includes(world))return '⚙';
 if(['pixel','pop','stage'].includes(world))return '◇';
 if(['architecture','urban','build'].includes(world))return '▦';
 if(['ocean'].includes(world))return '≈';
 if(['noir','hero'].includes(world))return '◆';
 return '✧';
};
function card(theme,num){
 const dna=t().world(theme.name),n=num||0,m=motif(theme.world);
 const cardClass='theme-tile theme-world-'+safe(theme.world);
 const action=n?'explore':'add';
 return '<article class="'+cardClass+'" data-theme-name="'+safe(theme.name)+'" style="--world-accent:'+safe(theme.accent)+';--world-dark:'+safe(dna?.[0]||'#1e2539')+'">'+
 '<span class="theme-ambient-symbol" aria-hidden="true">'+m+'</span><span class="theme-ambient-studs" aria-hidden="true"></span>'+
 '<div class="theme-tile-head"><span class="theme-tile-ribbon">THEME '+String(theme.order+1).padStart(2,'0')+'</span><span class="theme-tile-count">'+n+' OWNED</span></div>'+
 '<div class="theme-tile-body"><span class="theme-tile-icon" aria-hidden="true">'+m+'</span><h3>'+safe(theme.name)+'</h3>'+
 '<p>'+safe(dna?.title||'Collector Universe')+'</p></div>'+
 '<div class="theme-tile-foot"><span>OFFICIAL LEGO.COM</span><button type="button" data-theme-action="'+action+'" data-theme-name="'+safe(theme.name)+'">'+(n?'View sets':'Add your first')+' ↗</button></div>'+
 '</article>'
}
function render(){
 const root=document.getElementById('page-themes');if(!root||!t())return;
 const counts=stats(),all=t().list(),collected=all.filter(x=>(counts.get(x.name)||0)>0).length;
 const needle=q.toLowerCase();
 const visible=all.filter(x=>(mode==='all'||counts.get(x.name)>0)&&(!needle||x.name.toLowerCase().includes(needle)||x.world.toLowerCase().includes(needle)));
 const html='<div class="theme-hub">'+
 '<header class="theme-hero"><div class="theme-hero-orbit" aria-hidden="true"></div><div class="theme-hero-brick b1" aria-hidden="true"></div><div class="theme-hero-brick b2" aria-hidden="true"></div>'+
 '<div class="theme-hero-copy"><div class="eyebrow">LEGO VAULT / THEME ATLAS</div><h1>Every theme.<br><span>A universe to build.</span></h1>'+
 '<p>Explore every current theme in the official LEGO Denmark catalogue. Your own collection counts appear beside each world.</p></div>'+
 '<div class="theme-counter"><strong>'+all.length+'</strong><span>OFFICIAL<br>THEMES</span></div></header>'+
 '<div class="theme-control-bar"><div class="theme-selector"><button type="button" data-theme-mode="all" class="'+(mode==='all'?'active':'')+'">All '+all.length+'</button>'+
 '<button type="button" data-theme-mode="collected" class="'+(mode==='collected'?'active':'')+'">In my collection · '+collected+'</button></div>'+
 '<label class="theme-searchbox"><span aria-hidden="true">⌕</span><input id="themeSearch" aria-label="Search official LEGO themes" placeholder="Search universes…" value="'+safe(q)+'"></label></div>'+
 '<p class="theme-verified-note"><span aria-hidden="true">✓</span> Matched to the LEGO Denmark themes directory · Checked '+safe(t().verifiedAt)+
 ' · <a href="'+THEMES_SOURCE+'" target="_blank" rel="noopener noreferrer">Official LEGO source ↗</a></p>'+
 '<div class="theme-atlas-grid">'+visible.map(x=>card(x,counts.get(x.name))).join('')+'</div>'+
 (visible.length?'':'<div class="theme-no-results">No worlds match. Try a different theme name.</div>')+
 '<div class="theme-legacy-foot"><div><strong>Have an older LEGO theme?</strong><p>Retired and historical themes can still be recorded. They are not claimed to be in today’s LEGO shop.</p></div><button class="btn" type="button" data-theme-action="legacy">Add a legacy set ↗</button></div>'+
 '</div>';
 root.innerHTML=html;
}
function prefill(name){
 addDialog();
 const sel=document.getElementById('newTheme');
 if(sel&&[...sel.options].some(o=>o.value===name))sel.value=name;
}
document.addEventListener('click',e=>{
 const modeButton=e.target.closest('[data-theme-mode]');
 if(modeButton){mode=modeButton.dataset.themeMode==='collected'?'collected':'all';render();return}
 const button=e.target.closest('[data-theme-action]');
 if(!button)return;
 const action=button.dataset.themeAction,name=button.dataset.themeName;
 if(action==='explore'){go('collection');category=name;render();return}
 if(action==='add')prefill(name);
 if(action==='legacy')prefill('Legacy / retired theme');
});
document.addEventListener('input',e=>{
 if(e.target.id!=='themeSearch')return;
 const input=e.target;const start=input.selectionStart,end=input.selectionEnd;
 q=input.value;render();const next=document.getElementById('themeSearch');
 next?.focus({preventScroll:true});if(next&&start!=null)next.setSelectionRange(start,end);
});
window.VaultThemePage={render,openAddTheme:prefill};
})();