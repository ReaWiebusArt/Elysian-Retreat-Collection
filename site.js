/* Site display logic — edit text, artworks, prices and colours in site-data.js or editor.html */
(()=>{'use strict';
const data=window.ELYSIAN_SITE;
if(!data){document.querySelector('#gallery').textContent='Could not load site-data.js. Please keep all website files together.';return;}
const s=data.settings;
const text=(id,value)=>{const el=document.getElementById(id); if(el)el.textContent=value||'';};
const setTheme=(key,value)=>document.documentElement.style.setProperty(key,value);
setTheme('--bg',s.background);setTheme('--ink',s.textColor);setTheme('--sub',s.mutedColor);setTheme('--accent',s.accentColor);
setTheme('--gallery-width',(s.galleryWidth||1110)+'px');setTheme('--art-height',(s.imageHeight||315)+'px');setTheme('--row-gap',(s.rowGap||100)+'px');setTheme('--col-gap',(s.columnGap||52)+'px');setTheme('--cols',s.desktopColumns||3);
text('brand',s.brand);text('eyebrow',s.eyebrow);text('hero-line-1',s.heroLine1);text('hero-line-2',s.heroLine2);text('intro',s.intro);
text('collection-heading',s.collectionHeading);text('collection-subheading',s.collectionSubheading);
text('location-note',s.locationNote);text('how-heading',s.howHeading);text('footer-heading',s.footerHeading);text('footer-small',s.footerSmall);
document.title=(s.brand||'Art by Rea')+' | The Elysian Collection';
const safeStripe=url=>/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+\/?$/.test(url||'');
const money=(value)=>{const symbol=s.currency==='AUD'?'A$':s.currency==='NZD'?'NZ$':(s.currency||'AUD')+' ';return symbol+Number(value||0).toFixed(2);};
const el=(tag,cls,content)=>{const node=document.createElement(tag); if(cls)node.className=cls;if(content!==undefined)node.textContent=content;return node;};
const gallery=document.getElementById('gallery');const dialog=document.getElementById('lightbox');
const imageView=document.getElementById('lightbox-image');const buyView=document.getElementById('lightbox-buy');
let lastTrigger;
const showArt=(item,trigger)=>{lastTrigger=trigger;imageView.src=item.image;imageView.alt=item.title+' — painting by Rea';
text('lightbox-title',item.title);text('lightbox-description',item.description);text('lightbox-price',money(item.price));
if(safeStripe(item.checkout)){buyView.href=item.checkout;buyView.hidden=false;}else{buyView.hidden=true;buyView.removeAttribute('href');}
dialog.showModal();};
const close=()=>{if(dialog.open)dialog.close();};
document.getElementById('close-lightbox').addEventListener('click',close);
dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
dialog.addEventListener('close',()=>lastTrigger?.focus());
for(const [index,item] of data.artworks.entries()){
const card=el('article','art-card');const btn=el('button','image-button');btn.type='button';btn.setAttribute('aria-label','Enlarge '+item.title);
const img=el('img');img.src=item.image;img.alt=item.title+' — artwork by Rea';img.loading=index<3?'eager':'lazy';img.decoding='async';btn.append(img);btn.addEventListener('click',()=>showArt(item,btn));card.append(btn);
const meta=el('div','small-line');meta.append(el('span','art-index',String(index+1).padStart(2,'0')+' / '+String(data.artworks.length).padStart(2,'0')));meta.append(el('span','price',money(item.price)));card.append(meta);
card.append(el('h3',null,item.title));card.append(el('p','art-desc',item.description));
const link=el('a','buy');link.target='_blank';link.rel='noopener noreferrer';
link.append(document.createTextNode('Purchase print'));
if(safeStripe(item.checkout)){link.href=item.checkout;link.setAttribute('aria-label','Purchase '+item.title+' securely with Stripe');}else{link.removeAttribute('href');link.textContent='Checkout link needed';}
card.append(link);gallery.append(card);
}
const steps=document.getElementById('steps');(s.howSteps||[]).forEach((step,i)=>{const row=el('div','step');row.append(el('span','step-n',String(i+1).padStart(2,'0')));row.append(el('h3',null,step.title));row.append(el('p',null,step.description));steps.append(row);});
})();
