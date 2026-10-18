/* LEGO Vault 3.0: opt-in Rebrickable metadata lookup.
   API keys are kept only in the visitor's local browser, never in the public GitHub repository. */
(()=>{
'use strict';
const K='lego-vault-rebrickable-key';
let requestId=0;
const icon='🔎';
const safe=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
async function lookup(){
 const idEl=document.getElementById('newId'),nameEl=document.getElementById('newName');
 if(!idEl||!nameEl)return;
 const id=idEl.value.replace(/-1$/,'').trim();
 if(!/^\d{4,7}$/.test(id)){flash('Enter a LEGO set number first (e.g. 75348)');return}
 const key=localStorage.getItem(K);
 if(!key){
   const wrap=document.getElementById('lookupConfig');
   wrap.hidden=false;wrap.querySelector('input').focus();
   flash('Add a Rebrickable API key to enable automatic lookups');return
 }
 const button=document.getElementById('lookupButton');
 button.disabled=true;button.textContent='Looking up…';
 const serial=++requestId;
 try{
  const ctl=new AbortController(),time=setTimeout(()=>ctl.abort(),12000);
  let r;
  try{r=await fetch('https://rebrickable.com/api/v3/lego/sets/'+id+'-1/',{
    headers:{Authorization:'key '+key},signal:ctl.signal,cache:'no-store'
  })}finally{clearTimeout(time)}
  if(!r.ok)throw Error(r.status===404?'Set not found':r.status===401||r.status===403?'Invalid API key':'API unavailable ('+r.status+')');
  const data=await r.json();
  if(serial!==requestId)return;
  nameEl.value=data.name||nameEl.value;
  if(Number.isFinite(data.num_parts))document.getElementById('newPieces').value=data.num_parts;
  if(Number.isFinite(data.year))document.getElementById('newYear').value=data.year;
  if(data.set_img_url){
   const preview=document.getElementById('lookupPreview');
   preview.src=data.set_img_url;preview.dataset.imageUrl=data.set_img_url;preview.hidden=false;
  }
  document.getElementById('lookupMessage').textContent='Found: '+data.name+' · '+data.year+' · '+data.num_parts+' pieces. Please verify the theme and prices.';
  flash('Set details found');
 }catch(e){document.getElementById('lookupMessage').textContent='Lookup unavailable: '+e.message+'. You can still enter everything manually.'}
 finally{button.disabled=false;button.textContent=icon+' Fill details';}
}
const origAdd=addDialog;
addDialog=function(){
 origAdd();
 const el=document.getElementById('newId');if(!el)return;
 const ui=document.createElement('div');
 ui.style.cssText='grid-column:1/-1;margin-top:-3px';
 ui.innerHTML='<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button id="lookupButton" class="btn" type="button">🔎 Fill details</button>'+
 '<span style="font-size:12px;color:#aeb7c8">Automatic name, year, pieces and picture via Rebrickable; price remains editable.</span></div>'+
 '<div id="lookupConfig" hidden style="margin-top:12px"><label class="input-label" for="lookupKey">Personal Rebrickable API key</label>'+
 '<input type="password" id="lookupKey" autocomplete="off" placeholder="Paste your free API key">'+
 '<button type="button" class="btn" id="lookupSaveKey">Save key on this device</button>'+
 '<p style="font-size:11px;color:#adb7c8">Get a key from rebrickable.com/api. Do not use this feature on shared devices with your own key.</p></div>'+
 '<p id="lookupMessage" style="color:#aeb7c8;font-size:11px;margin:9px 0 0" aria-live="polite"></p>'+
 '<img id="lookupPreview" hidden alt="Fetched LEGO set preview" style="width:120px;height:100px;object-fit:contain;background:#fff;border-radius:10px;margin-top:10px">';
 el.closest('div').after(ui);
 document.getElementById('lookupButton').onclick=lookup;
 document.getElementById('lookupSaveKey').onclick=()=>{
  const key=document.getElementById('lookupKey').value.trim();
  if(!/^[A-Za-z0-9_-]{12,128}$/.test(key)){flash('Check API key format');return}
  localStorage.setItem(K,key);document.getElementById('lookupConfig').hidden=true;lookup();
 };
 el.addEventListener('blur',()=>{if(localStorage.getItem(K)&&/^\d{4,7}(-1)?$/.test(el.value.trim())&&!nameEl())lookup()});
 function nameEl(){return document.getElementById('newName')?.value.trim()}
};
})();