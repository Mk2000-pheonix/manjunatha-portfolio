// V4 interaction layer — simple, editable, and dependency-free.
const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalIcon = document.getElementById('modalIcon');

// Smooth internal navigation
for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// Shared contact card used by the profile photo and the interactive phone in the Hero scene.
function openContactCard(){
  openModal('Manjunatha M K', `
    <div class="profile-modal-content">
      <button class="profile-modal-photo" type="button" data-open-photo aria-label="View profile photo larger and zoom">
        <img src="profile-photo.png" alt="Manjunatha M K">
        <span>View larger</span>
      </button>
      <p class="profile-modal-role">Data Engineer <span>•</span> Systems Engineer <span>•</span> Azure</p>
      <div class="profile-modal-links">
        <a href="mailto:mkmanjunatha9@gmail.com"><span class="modal-contact-icon email-icon">✉</span><span>Email</span><small>mkmanjunatha9@gmail.com</small></a>
        <a href="tel:+917338594205"><span class="modal-contact-icon phone-icon">☎</span><span>Phone</span><small>+91 7338594205</small></a>
        <a href="https://www.linkedin.com/in/manjunatha-m-k-abb34018a" target="_blank" rel="noopener noreferrer"><span class="modal-contact-icon linkedin-icon">in</span><span>LinkedIn</span><small>Connect on LinkedIn</small></a>
        <a href="https://github.com/Mk2000-pheonix" target="_blank" rel="noopener noreferrer"><span class="modal-contact-icon github-icon">&lt;/&gt;</span><span>GitHub</span><small>View my projects</small></a>
        <a href="https://www.instagram.com/_phoenix_manju?stkn=bXJmajBocHE1M2hm" target="_blank" rel="noopener noreferrer"><span class="modal-contact-icon instagram-icon">◎</span><span>Instagram</span><small>Follow on Instagram</small></a>
        <a href="https://wa.me/917338594205" target="_blank" rel="noopener noreferrer"><span class="modal-contact-icon whatsapp-icon"><img src="assets/icons/whatsapp.svg" alt=""></span><span>WhatsApp</span><small>Chat on WhatsApp</small></a>
      </div>
    </div>`);
}
const profilePhoto = document.querySelector('.profile-photo-slot');
profilePhoto?.addEventListener('click', openContactCard);
document.querySelector('[data-contact-hotspot]')?.addEventListener('click', openContactCard);

// Full-size, zoomable profile photo viewer.
const photoLightbox = document.getElementById('photoLightbox');
const photoViewport = document.getElementById('photoViewport');
const photoLightboxImage = document.getElementById('photoLightboxImage');
const photoZoomLabel = document.getElementById('photoZoomLabel');
let photoZoom = 1;
let photoPanX = 0;
let photoPanY = 0;
let photoDragging = false;
let photoDragStartX = 0;
let photoDragStartY = 0;

function renderPhotoZoom(){
  if (!photoLightboxImage) return;
  photoLightboxImage.style.transform = `translate(${photoPanX}px, ${photoPanY}px) scale(${photoZoom})`;
  if (photoZoomLabel) photoZoomLabel.textContent = `${Math.round(photoZoom * 100)}%`;
}
function setPhotoZoom(next){
  photoZoom = Math.min(3, Math.max(1, next));
  if (photoZoom === 1){ photoPanX = 0; photoPanY = 0; }
  renderPhotoZoom();
}
function openPhotoViewer(){
  if (!photoLightbox) return;
  photoZoom = 1; photoPanX = 0; photoPanY = 0; renderPhotoZoom();
  photoLightbox.classList.add('show');
  photoLightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closePhotoViewer(){
  if (!photoLightbox) return;
  photoLightbox.classList.remove('show');
  photoLightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-open-photo]');
  if (trigger){ e.preventDefault(); openPhotoViewer(); }
  if (e.target.closest('[data-photo-close]')) closePhotoViewer();
});
document.querySelector('[data-zoom-in]')?.addEventListener('click', () => setPhotoZoom(photoZoom + .25));
document.querySelector('[data-zoom-out]')?.addEventListener('click', () => setPhotoZoom(photoZoom - .25));
document.querySelector('[data-zoom-reset]')?.addEventListener('click', () => setPhotoZoom(1));
photoViewport?.addEventListener('wheel', e => {
  e.preventDefault();
  setPhotoZoom(photoZoom + (e.deltaY < 0 ? .1 : -.1));
}, {passive:false});
photoLightboxImage?.addEventListener('pointerdown', e => {
  if (photoZoom <= 1) return;
  photoDragging = true; photoDragStartX = e.clientX - photoPanX; photoDragStartY = e.clientY - photoPanY;
  photoLightboxImage.setPointerCapture?.(e.pointerId);
});
photoLightboxImage?.addEventListener('pointermove', e => {
  if (!photoDragging) return;
  photoPanX = e.clientX - photoDragStartX; photoPanY = e.clientY - photoDragStartY; renderPhotoZoom();
});
photoLightboxImage?.addEventListener('pointerup', () => { photoDragging = false; });
photoLightboxImage?.addEventListener('pointercancel', () => { photoDragging = false; });


// Clickable tool chips: show a concise explanation with the tool icon.
document.querySelectorAll('.tool-clickable').forEach(tool => {
  const openTool = () => {
    const title = tool.dataset.toolTitle || 'Tool';
    const what = tool.dataset.toolWhat || '';
    const use = tool.dataset.toolUse || '';
    const img = tool.querySelector('img');
    const iconSrc = img ? img.getAttribute('src') : (tool.dataset.toolIcon || '');
    openModal(title, `<p><strong>What it is:</strong> ${what}</p><p><strong>Why it is used:</strong> ${use}</p>`, iconSrc);
  };
  tool.addEventListener('click', openTool);
  tool.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTool(); } });
});

// Interactive skill / roadmap cards.
document.querySelectorAll('[data-modal-title]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.modalTitle, card.dataset.modalBody));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.modalTitle, card.dataset.modalBody);
    }
  });
});

function launchAwardCelebration(){
  const old=document.querySelector('.celebration-popper-layer');
  if(old) old.remove();
  const layer=document.createElement('div');
  layer.className='celebration-popper-layer';
  const colors=['#67e8f9','#a78bfa','#f0abfc','#f9a8d4','#fbbf24','#34d399','#60a5fa','#fb7185','#fde68a','#c4b5fd'];
  const sides=[
    {x:'4vw',y:'18vh',tx:'34vw',ty:'62vh'},
    {x:'96vw',y:'18vh',tx:'-34vw',ty:'62vh'},
    {x:'12vw',y:'7vh',tx:'28vw',ty:'70vh'},
    {x:'88vw',y:'7vh',tx:'-28vw',ty:'70vh'},
    {x:'25vw',y:'2vh',tx:'18vw',ty:'76vh'},
    {x:'75vw',y:'2vh',tx:'-18vw',ty:'76vh'}
  ];
  sides.forEach((s,si)=>{
    for(let i=0;i<24;i++){
      const p=document.createElement('i');
      const spread=(Math.random()-.5)*18;
      p.className='celebration-popper';
      p.style.setProperty('--x',`calc(${s.x} + ${spread}vw)`);
      p.style.setProperty('--y',`calc(${s.y} + ${(Math.random()-.5)*12}vh)`);
      p.style.setProperty('--tx',`${parseFloat(s.tx)+(Math.random()-.5)*16}vw`);
      p.style.setProperty('--ty',`${parseFloat(s.ty)+(Math.random()-.5)*20}vh`);
      p.style.setProperty('--r',`${(Math.random()-.5)*1500}deg`);
      p.style.setProperty('--c',colors[(i+si*3)%colors.length]);
      p.style.setProperty('--d',`${2.5+Math.random()*1.35}s`);
      p.style.setProperty('--delay',`${Math.random()*.45}s`);
      layer.appendChild(p);
    }
  });
  for(let i=0;i<30;i++){
    const b=document.createElement('b');
    b.className='celebration-burst';
    b.style.setProperty('--bx',`${48+(Math.random()-.5)*18}vw`);
    b.style.setProperty('--by',`${42+(Math.random()-.5)*20}vh`);
    b.style.setProperty('--bc',colors[i%colors.length]);
    b.style.setProperty('--br',`${(Math.random()-.5)*180}deg`);
    b.style.setProperty('--bd',`${.25+Math.random()*.7}s`);
    layer.appendChild(b);
  }
  // Fine glitter / sparkle particles for a softer premium celebration.
  for(let i=0;i<54;i++){
    const g=document.createElement('span');
    g.className='celebration-glitter';
    g.style.setProperty('--gx',`${12+Math.random()*76}vw`);
    g.style.setProperty('--gy',`${8+Math.random()*72}vh`);
    g.style.setProperty('--gc',colors[i%colors.length]);
    g.style.setProperty('--gs',`${3+Math.random()*5}px`);
    g.style.setProperty('--gd',`${1.7+Math.random()*1.9}s`);
    g.style.setProperty('--gdelay',`${Math.random()*.9}s`);
    layer.appendChild(g);
  }
  document.body.appendChild(layer);
  setTimeout(()=>layer.remove(),4500);
}

function openModal(title, body, iconSrc = '') {
  if (!modal) return;
  modalTitle.textContent = title;
  modalBody.innerHTML = body || '';
  if (modalIcon) {
    modalIcon.innerHTML = iconSrc ? `<img src="${iconSrc}" alt="">` : '';
    modalIcon.style.display = iconSrc ? 'grid' : 'none';
  }
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  if ((body || '').includes('award-modal-certificate')) launchAwardCelebration();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelector('[data-modal-close]')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (photoLightbox?.classList.contains('show')) closePhotoViewer(); else closeModal(); } });

// Demo-safe external buttons: these are intentionally disabled until real URLs are added.
document.querySelectorAll('[data-placeholder-link]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openModal('Link to be added', '<p>This button is ready. Add your real LinkedIn, GitHub, resume or project URL in <code>index.html</code>.</p><p class="modal-tip">Tip: replace the <code>href="#"</code> value with your actual link.</p>');
  });
});

// Interactive portfolio guide + career journey context.
function openPortfolioGuide(){
  const guide=document.querySelector('.hero-guide-character');
  const speech=document.getElementById('guideSpeech');
  if(!guide || !speech) return;
  const open=!speech.classList.contains('is-open');
  speech.classList.toggle('is-open',open);
  guide.classList.toggle('is-active',open);
  guide.setAttribute('aria-expanded',String(open));
  speech.setAttribute('aria-hidden',String(!open));
}
const heroGuide=document.querySelector('.hero-guide-character');
heroGuide?.addEventListener('click', (e)=>{ if(e.target.closest('.guide-speech')) return; openPortfolioGuide(); });
document.querySelector('.guide-speech-close')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  const speech=document.getElementById('guideSpeech');
  const guide=document.querySelector('.hero-guide-character');
  speech?.classList.remove('is-open'); guide?.classList.remove('is-active'); guide?.setAttribute('aria-expanded','false'); speech?.setAttribute('aria-hidden','true');
});
document.querySelector('[data-guide-nav]')?.addEventListener('click',()=>{
  const speech=document.getElementById('guideSpeech'); const guide=document.querySelector('.hero-guide');
  speech?.classList.remove('is-open'); guide?.classList.remove('is-active'); guide?.setAttribute('aria-expanded','false'); speech?.setAttribute('aria-hidden','true');
});

function openJourneyContext(el){
  const title=el.dataset.journeyTitle || 'Career Journey';
  const body=el.dataset.journeyBody || '';
  const icon=el.dataset.journeyIcon || '';
  openModal(title, body, icon);
}
document.querySelectorAll('.journey-clickable, .hero-journey-node').forEach(item=>{
  item.addEventListener('click',()=>openJourneyContext(item));
  item.addEventListener('keydown',e=>{ if(e.key==='Enter' || e.key===' '){e.preventDefault();openJourneyContext(item);} });
});

document.addEventListener('click', e => {
  const nav = e.target.closest('[data-guide-nav]');
  if (!nav) return;
  const href = nav.getAttribute('href');
  const target = href ? document.querySelector(href) : null;
  if (target){ e.preventDefault(); closeModal(); target.scrollIntoView({behavior:'smooth',block:'start'}); }
});

// V53 — Interactive objects inside the 3D workspace scene.
document.querySelectorAll('.scene-hotspot').forEach(item => {
  const openScene = () => {
    const title = item.dataset.sceneTitle || 'Workspace';
    const body = item.dataset.sceneBody || '';
    openModal(title, body);
  };
  item.addEventListener('click', openScene);
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openScene(); }
  });
});

// V54 — Robust phone/contact hotspot interaction.
document.addEventListener('click', (e) => {
  const phone = e.target.closest('[data-contact-hotspot]');
  if (!phone) return;
  e.preventDefault();
  e.stopPropagation();
  openContactCard();
});

// V57 — reveal sections smoothly as they enter the viewport and add compact section icons.
(function initSectionMotion(){
  const iconMap={
    about:'👤', skills:'⚙', 'data-engineering':'◈', projects:'🚀',
    tools:'🧰', certifications:'🏅', experience:'💼', education:'🎓', contact:'✉'
  };
  document.querySelectorAll('.section:not(.hero)').forEach(section=>{
    const title=section.querySelector('.section-title');
    if(title){ title.dataset.icon=iconMap[section.id] || '✦'; }
  });
  const sections=[...document.querySelectorAll('.section:not(.hero)')];
  if(!('IntersectionObserver' in window)){
    sections.forEach(s=>s.classList.add('section-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  sections.forEach(section=>observer.observe(section));
})();
