/* ============================================================
   LUMIÈRE IMAGE GALLERY — script.js
   CodeAlpha Frontend Internship · Task 1
   ============================================================ */

/* ── 1. IMAGE DATA ─────────────────────────────────────────── */
// Each image uses a reliable Unsplash direct URL with a unique photo ID.
// title, category, and height let us create a real masonry effect.
const IMAGES = [
  // NATURE
  { id:1,  src:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', title:'Misty Mountain Valley',    category:'nature',       h:300 },
  { id:2,  src:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', title:'Forest Morning Light',     category:'nature',       h:420 },
  { id:3,  src:'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80', title:'Wildflower Meadow',        category:'nature',       h:260 },
  { id:4,  src:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', title:'Sun Through the Pines',    category:'nature',       h:380 },
  { id:5,  src:'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80', title:'Lakeside Reflections',     category:'nature',       h:290 },

  // ARCHITECTURE
  { id:6,  src:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', title:'Glass & Steel Tower',      category:'architecture', h:400 },
  { id:7,  src:'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=800&q=80', title:'Ancient Arches',           category:'architecture', h:280 },
  { id:8,  src:'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80', title:'Brutalist Beauty',         category:'architecture', h:350 },
  { id:9,  src:'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80', title:'Cosy Interior',            category:'architecture', h:260 },
  { id:10, src:'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&q=80', title:'White Minimalism',         category:'architecture', h:320 },

  // TRAVEL
  { id:11, src:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', title:'Santorini Sunset',         category:'travel',       h:300 },
  { id:12, src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80', title:'Kyoto in Autumn',          category:'travel',       h:420 },
  { id:13, src:'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', title:'Indian Street Market',     category:'travel',       h:360 },
  { id:14, src:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', title:'London Morning',           category:'travel',       h:270 },
  { id:15, src:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', title:'Bali Rice Terraces',       category:'travel',       h:380 },

  // ABSTRACT
  { id:16, src:'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', title:'Color Flow',               category:'abstract',     h:260 },
  { id:17, src:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', title:'Geometric Dream',          category:'abstract',     h:340 },
  { id:18, src:'https://images.unsplash.com/photo-1604076913837-52ab5629fde2?w=800&q=80', title:'Neon Ripples',             category:'abstract',     h:290 },
  { id:19, src:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', title:'Pastel Gradient',          category:'abstract',     h:380 },

  // PORTRAITS
  { id:20, src:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', title:'Golden Hour Portrait',     category:'portraits',    h:400 },
  { id:21, src:'https://images.unsplash.com/photo-1504276048855-f3d60e69632f?w=800&q=80', title:'Urban Explorer',           category:'portraits',    h:300 },
  { id:22, src:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80', title:'Natural Light',            category:'portraits',    h:350 },
  { id:23, src:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', title:'Studio Glow',              category:'portraits',    h:280 },
  { id:24, src:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', title:'Classic Portrait',         category:'portraits',    h:420 },
];

/* ── 2. STATE ──────────────────────────────────────────────── */
let activeCategory = 'all';
let searchQuery    = '';
let lightboxIndex  = 0;       // index in FILTERED array
let filteredImages = [];      // currently visible images

// Favourites stored in localStorage
const FAV_KEY = 'lumiere_favs';
function getFavs()           { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }
function isFav(id)           { return getFavs().includes(id); }
function toggleFav(id) {
  const favs = getFavs();
  const idx  = favs.indexOf(id);
  if (idx === -1) favs.push(id); else favs.splice(idx, 1);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

/* ── 3. DOM REFS ────────────────────────────────────────────── */
const grid         = document.getElementById('galleryGrid');
const filterBtns   = document.querySelectorAll('.filter-btn');
const searchInput  = document.getElementById('searchInput');
const clearBtn     = document.getElementById('clearSearch');
const resultsCount = document.getElementById('resultsCount');
const noResults    = document.getElementById('noResults');
const searchTerm   = document.getElementById('searchTerm');
const themeToggle  = document.getElementById('themeToggle');
const backToTop    = document.getElementById('backToTop');

// Lightbox refs
const lightbox     = document.getElementById('lightbox');
const lbBackdrop   = document.getElementById('lightboxBackdrop');
const lbImage      = document.getElementById('lbImage');
const lbLoader     = document.getElementById('lbLoader');
const lbClose      = document.getElementById('lbClose');
const lbPrev       = document.getElementById('lbPrev');
const lbNext       = document.getElementById('lbNext');
const lbTitle      = document.getElementById('lbTitle');
const lbCategory   = document.getElementById('lbCategory');
const lbFav        = document.getElementById('lbFav');
const lbDownload   = document.getElementById('lbDownload');
const lbCurrent    = document.getElementById('lbCurrent');
const lbTotal      = document.getElementById('lbTotal');

/* ── 4. RENDER GALLERY ─────────────────────────────────────── */
function computeFiltered() {
  let imgs = IMAGES;

  // "Favorites" pseudo-category
  if (activeCategory === 'favorites') {
    const favs = getFavs();
    imgs = imgs.filter(img => favs.includes(img.id));
  } else if (activeCategory !== 'all') {
    imgs = imgs.filter(img => img.category === activeCategory);
  }

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    imgs = imgs.filter(img =>
      img.title.toLowerCase().includes(q) ||
      img.category.toLowerCase().includes(q)
    );
  }

  return imgs;
}

function renderGallery() {
  filteredImages = computeFiltered();
  grid.innerHTML = '';

  // Results bar
  if (filteredImages.length === 0) {
    resultsCount.classList.add('hidden');
    noResults.classList.remove('hidden');
    searchTerm.textContent = searchQuery || activeCategory;
  } else {
    resultsCount.classList.remove('hidden');
    noResults.classList.add('hidden');
    resultsCount.textContent = `${filteredImages.length} image${filteredImages.length !== 1 ? 's' : ''}`;
  }

  // Build cards
  filteredImages.forEach((img, idx) => {
    const fav = isFav(img.id);
    const card = document.createElement('article');
    card.className = 'gallery-item';
    card.setAttribute('aria-label', img.title);
    card.dataset.id  = img.id;
    card.dataset.idx = idx;

    card.innerHTML = `
      <img
        src="${img.src}"
        alt="${img.title}"
        loading="lazy"
        style="min-height:${img.h * 0.4}px;"
      />
      <div class="card-overlay">
        <span class="card-title">${img.title}</span>
        <span class="card-category">${img.category}</span>
      </div>
      <div class="card-actions">
        <button
          class="card-action-btn fav-btn${fav ? ' fav-active' : ''}"
          aria-label="Toggle favourite"
          data-id="${img.id}"
        >${fav ? '❤️' : '🤍'}</button>
        <button
          class="card-action-btn zoom-btn"
          aria-label="Open in lightbox"
          data-idx="${idx}"
        >🔍</button>
      </div>
    `;

    // Click anywhere on card → open lightbox
    card.addEventListener('click', (e) => {
      // But not when the fav/zoom button itself is clicked
      if (e.target.closest('.fav-btn')) return;
      openLightbox(idx);
    });

    // Fav button
    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(e.currentTarget.dataset.id);
      toggleFav(id);
      // Re-render only if in favorites filter
      if (activeCategory === 'favorites') {
        renderGallery();
      } else {
        const btn = e.currentTarget;
        const favNow = isFav(id);
        btn.textContent = favNow ? '❤️' : '🤍';
        btn.classList.toggle('fav-active', favNow);
        // Also update lightbox fav if open
        syncLightboxFav();
      }
    });

    grid.appendChild(card);
  });
}

/* ── 5. LIGHTBOX ────────────────────────────────────────────── */
function openLightbox(idx) {
  lightboxIndex = idx;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  loadLightboxImage();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function loadLightboxImage() {
  const img = filteredImages[lightboxIndex];
  if (!img) return;

  // Show loader, hide image
  lbLoader.style.display = 'flex';
  lbImage.style.opacity  = '0';

  // Set meta
  lbTitle.textContent    = img.title;
  lbCategory.textContent = img.category.toUpperCase();
  lbDownload.href        = img.src;
  lbDownload.download    = img.title.replace(/\s+/g, '_') + '.jpg';
  lbCurrent.textContent  = lightboxIndex + 1;
  lbTotal.textContent    = filteredImages.length;

  // Prev/next visibility
  lbPrev.style.visibility = lightboxIndex === 0                        ? 'hidden' : 'visible';
  lbNext.style.visibility = lightboxIndex === filteredImages.length-1  ? 'hidden' : 'visible';

  // Fav state
  syncLightboxFav();

  // Load image
  const temp = new Image();
  temp.onload = () => {
    lbImage.src            = img.src;
    lbImage.alt            = img.title;
    lbImage.style.opacity  = '1';
    lbLoader.style.display = 'none';
  };
  temp.onerror = () => { lbLoader.style.display = 'none'; };
  temp.src = img.src;
}

function syncLightboxFav() {
  const img    = filteredImages[lightboxIndex];
  if (!img) return;
  const favNow = isFav(img.id);
  lbFav.classList.toggle('fav-active', favNow);
  lbFav.querySelector('svg').style.fill = favNow ? 'var(--accent-2)' : 'none';
}

function navigateLightbox(delta) {
  const next = lightboxIndex + delta;
  if (next < 0 || next >= filteredImages.length) return;
  lightboxIndex = next;
  loadLightboxImage();
}

// Lightbox events
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => navigateLightbox(-1));
lbNext.addEventListener('click', () => navigateLightbox(+1));

lbFav.addEventListener('click', () => {
  const img = filteredImages[lightboxIndex];
  if (!img) return;
  toggleFav(img.id);
  syncLightboxFav();

  // Sync card fav button too
  const card = grid.querySelector(`[data-id="${img.id}"] .fav-btn`);
  if (card) {
    const favNow = isFav(img.id);
    card.textContent = favNow ? '❤️' : '🤍';
    card.classList.toggle('fav-active', favNow);
  }

  if (activeCategory === 'favorites') renderGallery();
});

/* ── 6. KEYBOARD NAVIGATION ─────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   navigateLightbox(-1);
  if (e.key === 'ArrowRight')  navigateLightbox(+1);
});

/* ── 7. FILTER BUTTONS ──────────────────────────────────────── */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderGallery();
  });
});

/* ── 8. SEARCH ──────────────────────────────────────────────── */
let searchDebounce;
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  clearBtn.classList.toggle('visible', searchQuery.length > 0);
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(renderGallery, 260);
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearBtn.classList.remove('visible');
  renderGallery();
  searchInput.focus();
});

/* ── 9. DARK MODE TOGGLE ────────────────────────────────────── */
const THEME_KEY = 'lumiere_theme';
// Load saved preference
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const next   = isDark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
});

/* ── 10. BACK-TO-TOP ────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 11. TOUCH SWIPE FOR LIGHTBOX ───────────────────────────── */
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive:true });
lightbox.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) navigateLightbox(dx < 0 ? 1 : -1);
});

/* ── 12. INIT ────────────────────────────────────────────────── */
renderGallery();
