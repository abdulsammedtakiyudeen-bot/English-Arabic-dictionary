(() => {
'use strict';
let deferredPrompt=null;
const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
if(standalone)return;
const bar=document.createElement('aside');bar.className='install-app-bar';bar.innerHTML='<div><strong>Learn on your home screen</strong><small>Install Arabic Learning for a convenient app-like experience.</small></div><button type="button" id="installAppButton">Install App</button><button type="button" id="dismissInstall" aria-label="Dismiss install message">×</button>';
document.body.appendChild(bar);
const btn=bar.querySelector('#installAppButton');
function show(){bar.classList.add('visible');}
function hide(){bar.classList.remove('visible');}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;show();});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;hide();});
btn.addEventListener('click',async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;hide();return;}const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);alert(isIOS?'To install: tap the Share button in Safari, then choose “Add to Home Screen”.':'If your browser supports installation, open its menu and choose “Install app” or “Add to Home screen”.');});
bar.querySelector('#dismissInstall').addEventListener('click',()=>{hide();try{sessionStorage.setItem('ialdInstallDismissed','1');}catch{}});
try{if(sessionStorage.getItem('ialdInstallDismissed')!=='1')setTimeout(show,1800);}catch{setTimeout(show,1800);}
})();
