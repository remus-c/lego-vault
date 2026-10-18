/* LEGO Vault 3.0 — optional per-user cloud synchronisation.
   All user records are secured by PostgreSQL RLS; no service-role key belongs here. */
(()=>{
'use strict';
const CONFIG_KEY='lego-vault-supabase-settings';
const BANNER='☁';
let sb=null,user=null,ready=false,busy=false,reconciling=false,dirty=false,remoteStamp=null,saveTimer=null,libPromise=null;
const cfg=()=>{let custom={};try{custom=JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}')}catch{}return {...(window.VAULT_CLOUD_CONFIG||{}),...custom}};
const label=()=>document.getElementById('cloudButton');
function paint(note){
 const b=label();if(!b)return;
 b.textContent=BANNER+' '+(note||(ready?'Cloud synced':user?'Cloud loading':sb?'Sign in':'Local only'));
 b.title=ready?'Changes synchronize across signed-in devices':'Local backups remain available';
 b.setAttribute('aria-label','Cloud sync settings — '+b.textContent);
}
const safe=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const cloudState=()=>JSON.parse(JSON.stringify(state));
function localCommit(newState){
 state={...makeDefault(),...newState,patches:newState.patches||{},added:Array.isArray(newState.added)?newState.added:[]};
 try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}
 render();
}
async function sdk(){
 if(window.supabase?.createClient)return window.supabase;
 if(libPromise)return libPromise;
 libPromise=new Promise((resolve,reject)=>{
 const script=document.createElement('script');
 script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
 script.crossOrigin='anonymous';script.onload=()=>window.supabase?.createClient?resolve(window.supabase):reject(new Error('Cloud library unavailable'));
 script.onerror=()=>reject(new Error('Cannot load the authentication library'));
 document.head.append(script);
 });
 return libPromise;
}
async function connect(){
 const {url,publishableKey}=cfg();if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url||'')||!publishableKey){paint('Local only');return}
 try{
 const lib=await sdk();
 sb=lib.createClient(url.replace(/\/$/,''),publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 sb.auth.onAuthStateChange((event,session)=>{
   if(event==='SIGNED_OUT'){user=null;ready=false;remoteStamp=null;paint('Sign in');return}
   if(session?.user&&(!user||user.id!==session.user.id)){
     user=session.user;ready=false;paint('Loading cloud');
     setTimeout(()=>reconcile(),0);
   }
 });
 const {data,error}=await sb.auth.getSession();if(error)throw error;
 if(data.session?.user){user=data.session.user;await reconcile()}
 else paint('Sign in');
 }catch(e){console.error('Cloud init',e);paint('Cloud offline');}
}
async function readRemote(){
 const {data,error}=await sb.from('vault_state').select('state,updated_at').eq('user_id',user.id).maybeSingle();
 if(error)throw error;return data;
}
async function writeNew(){
 const {data,error}=await sb.from('vault_state').insert({user_id:user.id,state:cloudState()}).select('updated_at').single();
 if(error)throw error;remoteStamp=data.updated_at;ready=true;dirty=false;paint('Cloud synced');
}
async function uploadLocal(force){
 if(!sb||!user)return;
 busy=true;paint('Uploading');
 try{
  const stamp=new Date().toISOString();
  if(force){
    const {data,error}=await sb.from('vault_state').upsert({user_id:user.id,state:cloudState(),updated_at:stamp},{onConflict:'user_id'}).select('updated_at').single();
    if(error)throw error;remoteStamp=data.updated_at;
  }else if(remoteStamp){
    const {data,error}=await sb.from('vault_state').update({state:cloudState(),updated_at:stamp}).eq('user_id',user.id).eq('updated_at',remoteStamp).select('updated_at').maybeSingle();
    if(error)throw error;
    if(!data){ready=false;dirty=true;paint('Sync conflict');flash('Changes on another device. Open Cloud Sync to choose a version.');return}
    remoteStamp=data.updated_at;
  }else await writeNew();
  dirty=false;ready=true;paint('Cloud synced');
 }catch(e){dirty=true;paint('Sync failed');flash('Cloud save failed; your changes are still on this device.');console.error(e)}
 finally{busy=false;if(dirty&&ready)schedule()}
}
async function reconcile(){
 if(!sb||!user||busy||reconciling)return;
 reconciling=true;ready=false;paint('Checking cloud');
 try{
 const remote=await readRemote();
 if(!remote){remoteStamp=null;await writeNew();return}
 remoteStamp=remote.updated_at;
 if(JSON.stringify(remote.state)===JSON.stringify(cloudState())){
   ready=true;dirty=false;paint('Cloud synced');return
 }
 paint('Choose version');
 showChoice(remote.state);
 }catch(e){ready=false;paint('Cloud error');console.error('Cloud read',e);flash('Unable to read cloud collection. Check Supabase setup.')}
 finally{reconciling=false}
}
function showChoice(remoteState){
 modal('<div class="modal-form"><div class="eyebrow">LEGO Vault 3.0 · Cloud sync</div><h2>Choose your collection</h2>'+
 '<p>Your browser and your cloud account have different changes. Nothing will be overwritten without your choice.</p>'+
 '<p>We recommend downloading a backup first, especially if you edited the collection on another device.</p>'+
 '<div class="modal-buttons"><button type="button" class="btn" id="cloudBackup">↓ Backup browser</button>'+
 '<button type="button" class="btn" id="cloudUseRemote">Use cloud copy</button>'+
 '<button type="button" class="btn primary" id="cloudUseLocal">Upload this browser</button></div></div>');
 document.getElementById('cloudBackup').onclick=()=>backup();
 document.getElementById('cloudUseRemote').onclick=()=>{localCommit(remoteState);dirty=false;ready=true;paint('Cloud synced');closeModal()};
 document.getElementById('cloudUseLocal').onclick=async()=>{closeModal();await uploadLocal(true)};
}
function schedule(){
 if(!user||!ready)return;
 dirty=true;paint('Unsaved cloud changes');
 clearTimeout(saveTimer);
 saveTimer=setTimeout(()=>{if(!busy&&ready)uploadLocal(false)},1000);
}
async function refresh(){
 if(!sb||!user||!ready||dirty||busy)return;
 try{const r=await readRemote();if(r&&r.updated_at!==remoteStamp){
   if(JSON.stringify(r.state)!==JSON.stringify(cloudState())){remoteStamp=r.updated_at;localCommit(r.state);paint('Updated from cloud')}
   else{remoteStamp=r.updated_at;paint('Cloud synced')}
 }}catch(e){console.warn('Cloud refresh',e)}
}
function open(){
 const {url,publishableKey}=cfg();
 const connected=Boolean(sb),signed=Boolean(user);
 modal('<div class="modal-form"><div class="eyebrow">VAULT 3.0</div><h2>Cloud sync</h2>'+
 '<p>Sign in on every device with the same email to synchronize your collection. Your original browser backup will remain available.</p>'+
 '<p class="input-label">Status: '+safe(label()?.textContent||'Local only')+'</p>'+
 (!connected?'<form id="cloudConfig"><label class="input-label">Supabase project URL</label>'+
 '<input type="url" id="cloudUrl" required placeholder="https://xxxx.supabase.co" value="'+safe(url||'')+'">'+
 '<label class="input-label">Supabase publishable / anon key (never a secret or service-role key)</label>'+
 '<input id="cloudKey" required type="text" autocomplete="off" value="'+safe(publishableKey||'')+'">'+
 '<div class="modal-buttons"><button class="btn primary" type="submit">Connect cloud</button></div></form>':
 signed?'<p>Signed in as <b>'+safe(user.email)+'</b>.</p><div class="modal-buttons">'+
 '<button id="cloudRefresh" class="btn" type="button">Refresh from cloud</button>'+
 '<button id="cloudLogout" class="btn" type="button">Sign out</button></div>':
 '<form id="cloudLogin"><label class="input-label">Your email address</label><input id="cloudEmail" required type="email" autocomplete="email" placeholder="you@example.com">'+
 '<div class="modal-buttons"><button class="btn primary" type="submit">Send sign-in link</button></div></form>')+
 '<p class="input-label" style="margin-top:16px">Your cloud data is private to your authenticated user account. The public GitHub site itself remains visible.</p></div>');
 if(!connected){
   document.getElementById('cloudConfig').onsubmit=e=>{e.preventDefault();let url=document.getElementById('cloudUrl').value.trim(),key=document.getElementById('cloudKey').value.trim();if(/secret|service_role/.test(key.toLowerCase())){flash('Never paste secret service-role keys into a website');return}
     localStorage.setItem(CONFIG_KEY,JSON.stringify({url,publishableKey:key}));closeModal();connect()};
 }else if(signed){
   document.getElementById('cloudRefresh').onclick=()=>{closeModal();reconcile()};
   document.getElementById('cloudLogout').onclick=async()=>{await sb.auth.signOut();user=null;ready=false;closeModal();paint('Sign in')};
 }else document.getElementById('cloudLogin').onsubmit=async e=>{
   e.preventDefault();const email=document.getElementById('cloudEmail').value.trim();
   const redirectTo=location.origin+location.pathname;
   const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo}});
   if(error){flash('Login error: '+error.message);return}
   flash('Check your email for the sign-in link');closeModal();
 };
}
const originalSave=save;
save=function(){originalSave();schedule()};
window.VaultCloud={open,schedule,refresh,connect};
const button=document.createElement('button');button.id='cloudButton';button.className='btn';button.type='button';button.textContent='☁ Local only';
button.addEventListener('click',open);
document.querySelector('.top-actions')?.prepend(button);
window.addEventListener('focus',refresh);
paint();connect();
})();