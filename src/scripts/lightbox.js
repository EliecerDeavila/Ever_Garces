(function() {
  var grid = document.getElementById('bento-grid');
  if (!grid) return;
  
  var tiles = Array.from(grid.querySelectorAll('a[data-lightbox="portfolio"]'));
  if (!tiles.length) return;

  var revealImg = function(img) {
    img.classList.remove('opacity-0');
    img.classList.add('opacity-100');
    img.dataset.loaded = 'true';
  };
  
  tiles.forEach(function(tile) {
    var img = tile.querySelector('img.img-real');
    if (!img) return;
    
    if (img.complete && img.naturalWidth > 0) {
      revealImg(img);
      return;
    }
    
    img.addEventListener('load', function() { revealImg(img); }, { once: true });
    img.addEventListener('error', function() {
      img.dataset.loaded = 'error';
      img.classList.remove('opacity-0');
      img.classList.add('opacity-100');
      img.style.opacity = '0.45';
      img.style.filter = 'grayscale(0.35)';
      tile.dataset.imgError = 'true';
    }, { once: true });
    
    if (typeof img.decode === 'function') {
      img.decode().then(function() { revealImg(img); }).catch(function() {});
    }
  });

  var overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.className = 'fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/90 p-4 md:p-8 opacity-0 transition-opacity duration-200';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Vista ampliada');
  
  overlay.innerHTML = '<button id="lb-close" aria-label="Cerrar" class="absolute right-4 top-4 z-[110] rounded-full bg-white/95 p-2.5 text-[#2E3F51] shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60">' +
    '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path d="M6 6l12 12" stroke-linecap="round"></path>' +
      '<path d="M18 6L6 18" stroke-linecap="round"></path>' +
    '</svg>' +
    '</button>' +
    '<div class="relative w-full max-w-[1100px]">' +
      '<img id="lb-image" class="mx-auto max-h-[78vh] w-auto rounded-2xl shadow-2xl ring-1 ring-white/10 select-none" alt="" />' +
      '<p id="lb-caption" class="mx-auto mt-4 max-w-[900px] text-center text-sm sm:text-base text-white/80"></p>' +
      '<button id="lb-prev" aria-label="Anterior" class="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-[#2E3F51] shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60">' +
        '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          '<path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '</svg>' +
      '</button>' +
      '<button id="lb-next" aria-label="Siguiente" class="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-[#2E3F51] shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60">' +
        '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          '<path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"></path>' +
        '</svg>' +
      '</button>' +
    '</div>';
  
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector('#lb-image');
  var captionEl = overlay.querySelector('#lb-caption');
  var closeBtn = overlay.querySelector('#lb-close');
  var prevBtn = overlay.querySelector('#lb-prev');
  var nextBtn = overlay.querySelector('#lb-next');

  var lightboxIndex = 0;
  var lastActive = null;

  var openLightbox = function(i) {
    lightboxIndex = i;
    var a = tiles[lightboxIndex];
    var src = a.getAttribute('href');
    var caption = a.dataset.caption || a.querySelector('img').alt || '';
    
    lastActive = document.activeElement;
    
    var preload = new Image();
    preload.onload = function() { imgEl.src = src; };
    preload.onerror = function() { imgEl.src = src; };
    preload.src = src;
    
    imgEl.alt = caption || 'Imagen';
    captionEl.textContent = caption;
    
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(function() {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
    });
    
    closeBtn.focus();
  };

  var closeLightbox = function() {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    
    setTimeout(function() {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      imgEl.removeAttribute('src');
      captionEl.textContent = '';
      if (lastActive && typeof lastActive.focus === 'function') lastActive.focus();
    }, 200);
  };

  var prevImg = function() { openLightbox((lightboxIndex - 1 + tiles.length) % tiles.length); };
  var nextImg = function() { openLightbox((lightboxIndex + 1) % tiles.length); };

  grid.addEventListener('click', function(e) {
    var a = e.target.closest('a[data-lightbox="portfolio"]');
    if (!a) return;
    e.preventDefault();
    var i = tiles.indexOf(a);
    if (i >= 0) openLightbox(i);
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', prevImg);
  nextBtn.addEventListener('click', nextImg);

  overlay.addEventListener('click', function(e) {
    var inside = e.target.closest('.relative.w-full.max-w-\\[1100px\\]');
    if (!inside) closeLightbox();
  });

  window.addEventListener('keydown', function(e) {
    if (overlay.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImg();
    if (e.key === 'ArrowRight') nextImg();
  });
})();
