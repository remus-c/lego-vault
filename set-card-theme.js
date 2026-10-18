/* LEGO Vault 3.2 | Theme-aware collector exhibit system.
   The registered official LEGO theme stays separate from the visual scene. No
   external images, licenses or network calls are required for decorative art.
   Supports all 47 current themes through the 21 atmosphere world presets. */
(()=>{
'use strict';
const visuallyDistinct={
 '42155':{scene:'noir',note:'GOTHAM ENGINEERING'}, // Batman Batcycle is officially Technic
 '42127':{scene:'noir',note:'GOTHAM ENGINEERING'},
 '76240':{scene:'noir',note:'THE DARK KNIGHT'},
 '76271':{scene:'noir',note:'GOTHAM CITY'},
 '72046':{scene:'pixel',note:'RETRO ARCADE'}, // official theme: Super Mario
 '10323':{scene:'pixel',note:'RETRO ARCADE'}, // official theme: Icons
 '75304':{scene:'galaxy',note:'HELMET ARCHIVE'},
 '75192':{scene:'galaxy',note:'GALACTIC FLAGSHIP'},
 '42083':{scene:'racing',note:'HYPERCAR ATELIER'},
 '21330':{scene:'gallery',note:'CINEMA COLLECTION'}, // official theme: Ideas
 '21333':{scene:'gallery',note:'ART GALLERY'}
};
const accents={
 galaxy:{secondary:'#d2e8ff',deep:'#17284c',title:'GALACTIC ARCHIVE',symbol:'✦'},
 noir:{secondary:'#c9a6fd',deep:'#292139',title:'GOTHAM NOIR',symbol:'◆'},
 garden:{secondary:'#ffd1dd',deep:'#214d43',title:'LIVING GARDEN',symbol:'❀'},
 mechanical:{secondary:'#f6ad88',deep:'#173650',title:'ENGINEERING LAB',symbol:'⚙'},
 racing:{secondary:'#ffbb8e',deep:'#342434',title:'VELOCITY GARAGE',symbol:'↗'},
 pixel:{secondary:'#ffc4ef',deep:'#293258',title:'PIXEL WORLD',symbol:'▣'},
 fantasy:{secondary:'#f6deab',deep:'#253e3b',title:'MYTHIC REALM',symbol:'✧'},
 magic:{secondary:'#e3c5ff',deep:'#35304e',title:'ENCHANTED REALM',symbol:'✧'},
 hero:{secondary:'#ffd2a0',deep:'#342738',title:'HERO UNIVERSE',symbol:'◆'},
 ocean:{secondary:'#b5fbf2',deep:'#164458',title:'OCEAN REALM',symbol:'≈'},
 architecture:{secondary:'#e0d7be',deep:'#333e56',title:'ARCHITECTURE STUDIO',symbol:'▦'},
 urban:{secondary:'#c5deff',deep:'#21384d',title:'CITYSCAPE',symbol:'▦'},
 stage:{secondary:'#f7b3e5',deep:'#3b2747',title:'SPOTLIGHT STAGE',symbol:'✦'},
 play:{secondary:'#ffe0aa',deep:'#3b3455',title:'CREATIVE PLAY',symbol:'◈'},
 gallery:{secondary:'#fbe0bf',deep:'#362b4b',title:'COLLECTOR GALLERY',symbol:'◈'},
 build:{secondary:'#ffe2bd',deep:'#35314a',title:'BUILD STUDIO',symbol:'▦'},
 pop:{secondary:'#ffdbad',deep:'#43314a',title:'POP CULTURE',symbol:'✦'},
 dream:{secondary:'#e9b9fc',deep:'#333057',title:'DREAM WORLD',symbol:'✧'},
 jungle:{secondary:'#c7ecac',deep:'#294938',title:'JUNGLE REALM',symbol:'❀'},
 education:{secondary:'#ccede8',deep:'#294257',title:'BUILD & LEARN',symbol:'◈'},
 sports:{secondary:'#ffd4ae',deep:'#403146',title:'SPORT ARENA',symbol:'↗'}
};
const optionalLegacy={
 'Technic & Cars':{world:'mechanical',accent:'#74c8ff'},
 'Gaming & Icons':{world:'pixel',accent:'#ffa982'},
 'Movies & TV':{world:'stage',accent:'#ee9dd5'},
 'Art & Design':{world:'gallery',accent:'#f3cda3'},
 'Other / Uncategorised':{world:'gallery',accent:'#afc5f0'},
 'Legacy / retired theme':{world:'gallery',accent:'#d6bdff'}
};
const validHex=s=>typeof s==='string'&&/^#[0-9a-f]{6}$/i.test(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function skin(set){
 const registry=window.VaultThemeCatalog;
 const official=registry?.forSet(set)||String(set?.theme||'Other / Uncategorised');
 const def=registry?.get(official);
 const legacy=optionalLegacy[set?.theme]||optionalLegacy[official]||optionalLegacy['Other / Uncategorised'];
 const variant=visuallyDistinct[String(set?.id||'')];
 const world=variant?.scene||(def?.world||legacy.world);
 const dna=accents[world]||accents.gallery;
 const color=validHex(def?.accent)?def.accent:legacy.accent;
 return {official,world,accent:color,secondary:dna.secondary,deep:dna.deep,
  symbol:dna.symbol,label:variant?.note||dna.title,
  aestheticOverride:Boolean(variant?.scene&&variant.scene!==def?.world)};
}
function attrs(set){
 const s=skin(set);
 return 'data-vault-world="'+escape(s.world)+'" data-vault-theme="'+escape(s.official)+'" style="--v-card-accent:'+s.accent+';--v-card-secondary:'+s.secondary+';--v-card-deep:'+s.deep+'"';
}
function scene(set){
 const s=skin(set);
 return '<div class="vault-exhibit-art" aria-hidden="true">'+
 '<div class="vault-exhibit-dust"></div><div class="vault-exhibit-aurora"></div>'+
 '<div class="vault-exhibit-halo"></div><div class="vault-exhibit-motif">'+escape(s.symbol)+'</div>'+
 '<div class="vault-exhibit-brick one"><i></i><i></i></div>'+
 '<div class="vault-exhibit-brick two"><i></i><i></i></div>'+
 '<div class="vault-exhibit-track"></div></div>';
}
function exhibitRibbon(set){
 const s=skin(set);
 return '<div class="vault-exhibit-ribbon" aria-hidden="true"><span class="vault-exhibit-pin">●</span> '+escape(s.label)+'</div>';
}
function label(set){
 const s=skin(set);
 return '<span class="vault-collector-theme"><i aria-hidden="true">'+escape(s.symbol)+'</i>'+escape(s.official)+'</span>';
}
function modalLabel(set){
 const s=skin(set);
 return '<span class="vault-modal-world"><span aria-hidden="true">'+escape(s.symbol)+'</span> '+escape(s.label)+'</span>';
}
window.VaultCardTheme=Object.freeze({skin,attrs,scene,exhibitRibbon,label,modalLabel,
 worldCount:Object.keys(accents).length,overrides:Object.keys(visuallyDistinct).length});
})();