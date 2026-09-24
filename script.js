// V4 interaction layer — simple, editable, and dependency-free.
const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

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

// Hero profile photo contact card.
const profilePhoto = document.querySelector('.profile-photo-slot');
profilePhoto?.addEventListener('click', () => {
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
      </div>
    </div>`);
});

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

function openModal(title, body) {
  if (!modal) return;
  modalTitle.textContent = title;
  modalBody.innerHTML = body || '';
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
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
