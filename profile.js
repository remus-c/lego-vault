/* LEGO Vault Collector Profile.
   Presentation is derived from the existing owned collection; profile fields
   live in state.profile and use the existing save()/Supabase sync adapter.
   Future public profiles can use a separate, explicit visibility service. */
(()=>{
'use strict';
const COVER_STYLES=[['galaxy','Galactic blue'],['gotham','Gotham violet'],['garden','Botanical green'],['atelier','Warm atelier']];
const AVATARS=[['✦','Starlight'],['◈','Facet'],['⬡','Hexagon'],['◆','Diamond']];
const DEFAULT_PROFILE={version:1,displayName:'Vault Collector',handle:'brickcollector',bio:'Collecting iconic builds, one brick at a time. Every set has a story.',location:'',cover:'galaxy',avatar:'✦',featuredIds:['75192','76271','42083']};
const el=id=>document.getElementById(id);
const safe=x=>escapeHTML(String(x==null?'':x));
const numeric=x=>new Intl.NumberFormat('da-DK',{maximumFractionDigits:0}).format(x||0);
const pickProfile=()=>{
 const x=state.profile&&typeof state.profile==='object'&&!Array.isArray(state.profile)?state.profile:{};
 const p={...DEFAULT_PROFILE,...x};
 if(!COVER_STYLES.some(i=>i[0]===p.cover))p.cover='galaxy';
 if(!AVATARS.some(i=>i[0]===p.avatar))p.avatar='✦';
 if(!Array.isArray(p.featuredIds))p.featuredIds=DEFAULT_PROFILE.featuredIds;
 return p;
};
function getHighlights(p){
 const o=owned(),m=new Map(o.map(x=>[x.id,x])),seen=new Set(),out=[];
 const candidates=[...p.featuredIds,...DEFAULT_PROFILE.featuredIds,...o.map(x=>x.id)];
 for(const id of candidates){
  if(m.has(id)&&!seen.has(id)){out.push(m.get(id));seen.add(id)}
  if(out.length===3)break;
 }
 return out;
}
function achievements(o){
 const n=theme=>o.filter(s=>s.theme===theme).length;
 const h=ownedHelmets().length;
 return [
 {icon:'✦',name:'The Archivist',detail:'Curate 25 sets',count:o.length,target:25},
 {icon:'✧',name:'Across the Galaxy',detail:'Own 10 Star Wars sets',count:n('Star Wars'),target:10},
 {icon:'♜',name:'Gotham Guardian',detail:'Own 3 Batman sets',count:n('Batman'),target:3},
 {icon:'❀',name:'The Greenhouse',detail:'Grow 5 Botanicals sets',count:n('Botanicals'),target:5},
 {icon:'⚙',name:'Engineering Club',detail:'Own 3 Technic / car sets',count:n('Technic & Cars'),target:3},
 {icon:'◈',name:'Helmet Completionist',detail:'Collect all 15 helmets',count:h,target:15}
 ];
}
const meter=(label,value,foot)=>'<article class="profile-metric"><span class="profile-metric-label">'+safe(label)+'</span><strong>'+safe(value)+'</strong><small>'+safe(foot)+'</small></article>';
function medal(a){
 const unlocked=a.count>=a.target;
 return '<article class="profile-medal'+(unlocked?'':' locked')+'" aria-label="'+safe(a.name+(unlocked?', unlocked':', in progress'))+'">'+
 '<div class="profile-medal-icon" aria-hidden="true">'+safe(a.icon)+'</div>'+
 '<strong>'+safe(a.name)+'</strong><small>'+safe(a.detail)+'</small>'+
 '<div class="profile-medal-state">'+(unlocked?'✦ Unlocked':numeric(a.count)+' / '+numeric(a.target)+' · In progress')+'</div></article>';
}
function spotlight(s,index){
 const url=safeSetImage(s);
 return '<article class="profile-feature">'+
 '<div class="profile-feature-image"><div class="profile-feature-fallback" aria-hidden="true"><span>VAULT • '+safe(s.theme)+'</span><strong>#'+safe(s.id)+'</strong></div><span class="profile-feature-no">0'+(index+1)+'</span>'+
 '<img loading="lazy" decoding="async" src="'+url+'" alt="'+safe(s.name)+'" onerror="this.style.display=\'none\'"></div>'+
 '<div class="profile-feature-content"><small>'+safe(s.theme)+'</small><strong>'+safe(s.name)+'</strong>'+
 '<div class="profile-feature-meta"><span>Set #'+safe(s.id)+'</span><span>'+numeric(s.pieces||0)+' pcs</span></div>'+
 '<button type="button" data-action="details" data-id="'+safe(s.id)+'">View this set ↗</button></div></article>';
}
function universeTile(theme,n,themeColor){
 return '<button class="profile-theme-card" type="button" data-profile-filter="'+safe(theme)+'" style="--theme-color:'+safe(themeColor)+'" aria-label="Explore '+safe(theme)+' collection">'+
 '<strong>'+numeric(n)+'</strong><span>'+safe(theme)+'</span></button>';
}
function renderProfile(){
 const target=el('page-profile');if(!target)return;
 const p=pickProfile(),o=owned(),h=ownedHelmets().length;
 const pc=o.reduce((n,s)=>n+(Number(s.pieces)||0),0);
 const xp=o.length*10+h*5,level=Math.floor(xp/100)+1,rem=xp%100;
 const list=achievements(o),won=list.filter(a=>a.count>=a.target).length;
 const handle=String(p.handle||'brickcollector').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,22)||'brickcollector';
 const themes=THEMES.map(n=>({name:n,count:o.filter(s=>s.theme===n).length,color:COLORS[n]||'#c9d5e7'})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);
 const feats=getHighlights(p);
 let html='<div class="profile-page profile-theme-'+safe(p.cover)+'">'+
 '<div class="profile-sup">THE COLLECTOR FILE / YOUR PERSONAL SPACE</div>'+
 '<section class="profile-cover" aria-label="Collector profile banner">'+
 '<div class="profile-cover-top"><span class="profile-kicker">VAULT • COLLECTOR PROFILE</span><span class="profile-visibility">◌ Personal profile preview</span></div>'+
 '<div class="profile-cover-decoration" aria-hidden="true">V.</div>'+
 '<div class="profile-cover-body"><div class="profile-identity"><div class="profile-avatar" aria-hidden="true"><span>'+safe(p.avatar)+'</span></div><div>'+
 '<div class="profile-handle">@'+safe(handle)+'</div><h1>'+safe(p.displayName)+'</h1>'+
 '<p class="profile-blurb">'+safe(p.bio||DEFAULT_PROFILE.bio)+'</p></div></div>'+
 '<button class="profile-edit" type="button" data-profile-action="edit">✎ &nbsp; Customize profile</button></div></section>'+
 '<div class="profile-stripe"><strong>COLLECTOR / LEVEL '+numeric(level)+'</strong>'+
 '<span class="profile-bullet"></span><span>'+safe(p.location||'Location not shared')+'</span>'+
 '<span class="profile-bullet"></span><span>'+numeric(won)+' of '+numeric(list.length)+' achievements unlocked</span></div>'+
 '<div class="profile-metrics">'+
 meter('Sets collected',numeric(o.length),'Confirmed ownership')+
 meter('Pieces collected',numeric(pc),'Known piece counts')+
 meter('Helmet archive',h+' / '+helmets().length,'Star Wars series')+
 meter('On your radar',numeric(wishes().length),'Wishlist sets')+'</div>'+
 '<section><div class="profile-section-top"><div><div class="profile-sup">CURATED BY YOU</div><h2>In the spotlight</h2><p>Three favorite builds from your collection, chosen for your personal shelf.</p></div>'+
 '<button type="button" class="profile-mini-btn" data-profile-action="edit">Edit display ↗</button></div>'+
 '<div class="profile-showcase">'+feats.map(spotlight).join('')+'</div></section>'+
 '<div class="profile-two-col"><section>'+
 '<div class="profile-section-top"><div><div class="profile-sup">MILESTONES</div><h2>The trophy cabinet</h2><p>Earned from your real LEGO collection. More to come.</p></div><span class="profile-tiny">'+numeric(won)+' unlocked</span></div>'+
 '<div class="profile-achievements">'+list.map(medal).join('')+'</div></section>'+
 '<aside><div class="profile-section-top"><div><div class="profile-sup">COLLECTOR PROGRESSION</div><h2>Your journey</h2><p>Every confirmed set moves you forward.</p></div></div>'+
 '<div class="profile-panel"><div class="profile-panel-in"><div class="profile-level-intro"><div><div class="profile-level-no">LVL '+numeric(level)+'</div>'+
 '<div class="profile-level-title">The collection never stops</div></div><div class="profile-level-score">'+numeric(xp)+' XP<br>earned</div></div>'+
 '<div class="profile-progress" role="progressbar" aria-label="Progress to next level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+rem+'"><span style="width:'+rem+'%"></span></div>'+
 '<div class="profile-level-foot"><span>'+numeric(rem)+' / 100 XP</span><span>Next level '+numeric(level+1)+'</span></div>'+
 '<p class="profile-level-explain">10 XP per owned set · 5 bonus XP per confirmed helmet. A preview of the future Vault achievement system.</p>'+
 '</div></div>'+
 '<div class="profile-section-top"><div><div class="profile-sup">YOUR UNIVERSE</div><h2>Collecting worlds</h2></div></div>'+
 '<div class="profile-universe">'+themes.map(x=>universeTile(x.name,x.count,x.color)).join('')+'</div></aside></div>'+
 '<div class="profile-small-foot">This is your personal profile preview. It is not a public account directory or marketplace listing. Personal edits sync with your signed-in Vault account.</div>'+
 '</div>';
 target.innerHTML=html;
}
function optForId(id,selected){
 const x=owned().slice().sort((a,b)=>a.name.localeCompare(b.name));
 return '<option value="">Choose an owned set</option>'+x.map(s=>'<option value="'+safe(s.id)+'"'+(s.id===selected?' selected':'')+'>'+safe(s.name)+' · #'+safe(s.id)+'</option>').join('');
}
function openEditor(){
 const p=pickProfile(),choices=getHighlights(p).map(x=>x.id);
 modal('<div class="modal-form profile-editor"><div class="eyebrow">COLLECTOR STUDIO</div>'+
 '<h2>Make it yours.</h2><p>Personalize your collector profile. Changes are saved locally and synchronized when Cloud Sync is connected.</p>'+
 '<form id="profileForm"><div class="profile-formgrid">'+
 '<div><label for="profileName">Display name</label><input id="profileName" required maxlength="50" value="'+safe(p.displayName)+'" placeholder="Your collector name"></div>'+
 '<div><label for="profileHandle">Collector handle (preview)</label><input id="profileHandle" pattern="[A-Za-z0-9_-]{3,22}" maxlength="22" required value="'+safe(p.handle)+'" placeholder="brickcollector"></div>'+
 '<div class="profile-fieldwide"><label for="profileBio">Collector bio</label><textarea id="profileBio" maxlength="170" placeholder="What makes your collection special?">'+safe(p.bio)+'</textarea></div>'+
 '<div><label for="profileLocation">Location (optional)</label><input id="profileLocation" maxlength="45" value="'+safe(p.location)+'" placeholder="Leave blank to hide"></div>'+
 '<div><label for="profileAvatar">Avatar insignia</label><select id="profileAvatar">'+AVATARS.map(x=>'<option value="'+safe(x[0])+'"'+(p.avatar===x[0]?' selected':'')+'>'+safe(x[1])+'</option>').join('')+'</select></div>'+
 '<div class="profile-fieldwide"><label>Cover atmosphere</label><div class="profile-palette">'+COVER_STYLES.map(x=>'<label><input type="radio" name="profileCover" value="'+safe(x[0])+'"'+(p.cover===x[0]?' checked':'')+'>'+safe(x[1])+'</label>').join('')+'</div></div>'+
 '<div class="profile-fieldwide"><label>Your display shelf — 3 sets</label><p class="profile-help">Only confirmed owned sets appear. Duplicates are automatically removed.</p></div>'+
 [0,1,2].map(i=>'<div><label for="profileShelf'+i+'">Spotlight '+(i+1)+'</label><select id="profileShelf'+i+'">'+optForId(i,choices[i]||'')+'</select></div>').join('')+
 '</div><div class="modal-buttons"><button type="button" class="btn ghost" data-action="close">Cancel</button>'+
 '<button type="submit" class="btn primary">Save profile</button></div></form></div>');
 el('profileForm').onsubmit=e=>{
  e.preventDefault();
  const form=el('profileForm');if(!form.reportValidity())return;
  const name=el('profileName').value.trim(),handle=el('profileHandle').value.trim().toLowerCase();
  if(!name||!/^[a-z0-9_-]{3,22}$/.test(handle)){flash('Enter a valid display name and handle');return}
  const idList=[0,1,2].map(i=>el('profileShelf'+i).value).filter(Boolean);
  const clean=[...new Set(idList)].filter(id=>owned().some(s=>s.id===id));
  const old=pickProfile();
  state.profile={...old,version:1,displayName:name.slice(0,50),handle,
    bio:el('profileBio').value.trim().slice(0,170),
    location:el('profileLocation').value.trim().slice(0,45),
    avatar:el('profileAvatar').value,
    cover:form.querySelector('input[name="profileCover"]:checked')?.value||'galaxy',
    featuredIds:clean};
  save();closeModal();render();flash('Collector profile saved');
 };
}
document.addEventListener('click',event=>{
 const edit=event.target.closest('[data-profile-action]');
 if(edit){event.preventDefault();if(edit.dataset.profileAction==='edit')openEditor();return}
 const filter=event.target.closest('[data-profile-filter]');
 if(filter){event.preventDefault();go('collection');category=filter.dataset.profileFilter;render()}
});
window.VaultProfile={render:renderProfile,edit:openEditor,version:1};
if(view==='profile')render();
})();