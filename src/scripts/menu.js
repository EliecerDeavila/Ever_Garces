document.addEventListener('DOMContentLoaded', function() {
  const $ = function(sel, root) {
    if (root === undefined) root = document;
    return root.querySelector(sel);
  };
  
  const $$ = function(sel, root) {
    if (root === undefined) root = document;
    return Array.from(root.querySelectorAll(sel));
  };

  var header = $('#site-header');
  
  function headerOffset() {
    if (header) return header.getBoundingClientRect().height;
    return 0;
  }

  var drawer = $('#mobile-drawer');
  var backdrop = $('#backdrop');
  var btnOpen = $('#btn-open-menu');
  var btnClose = $('#btn-close-menu');

  function openDrawer() {
    if (!drawer || !btnOpen) return;
    drawer.classList.remove('hidden');
    requestAnimationFrame(function() {
      drawer.classList.remove('translate-x-full');
    });
    if (backdrop) backdrop.classList.remove('hidden');
    btnOpen.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('overflow-hidden');
  }

  function closeDrawer() {
    if (!drawer || !btnOpen) return;
    drawer.classList.add('translate-x-full');
    btnOpen.setAttribute('aria-expanded', 'false');
    setTimeout(function() {
      drawer.classList.add('hidden');
      if (backdrop) backdrop.classList.add('hidden');
      document.documentElement.classList.remove('overflow-hidden');
    }, 220);
  }

  if (btnOpen && drawer) btnOpen.addEventListener('click', openDrawer);
  if (btnClose && drawer) btnClose.addEventListener('click', closeDrawer);
  if (backdrop && drawer) backdrop.addEventListener('click', closeDrawer);

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDrawer();
  });

  $$('#mobile-drawer a.nav-link[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function() { closeDrawer(); });
  });

  var navLinks = $$('.nav-link');
  
  function setActiveByHref(href) {
    navLinks.forEach(function(a) {
      var isActive = a.getAttribute('href') === href;
      a.classList.toggle('nav-active', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function smoothScrollTo(targetId) {
    var el = document.querySelector(targetId);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - headerOffset() + 1;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      e.preventDefault();
      history.pushState(null, '', href);
      setActiveByHref(href);
      smoothScrollTo(href);
      closeDrawer();
    }, { passive: false });
  });

  window.addEventListener('hashchange', function() {
    var hash = window.location.hash || '#inicio';
    setActiveByHref(hash);
    if (window.location.hash) smoothScrollTo(window.location.hash);
  });

  var idsInMenu = new Set(
    navLinks
      .map(function(a) { return a.getAttribute('href') || ''; })
      .filter(function(h) { return h.startsWith('#') && h.length > 1; })
      .map(function(h) { return h.slice(1); })
  );
  idsInMenu.add('reels');

  function getTargetsOrdered() {
    var els = Array.from(idsInMenu)
      .map(function(id) { return document.getElementById(id); })
      .filter(function(Boolean) { return Boolean; });
    
    els.sort(function(a, b) {
      if (a === b) return 0;
      var pos = a.compareDocumentPosition(b);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
    
    return els;
  }

  function computeActiveByScroll() {
    var targets = getTargetsOrdered();
    if (!targets.length) return;
    var offset = headerOffset() + 8;
    var currentId = targets[0].id;
    
    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      var top = el.getBoundingClientRect().top;
      if (top - offset <= 0) currentId = el.id;
      else break;
    }
    
    function hrefForId(id) {
      return id === 'reels' ? '#inicio' : '#' + id;
    }
    setActiveByHref(hrefForId(currentId));
  }

  var io = null;
  function createObserver() {
    var targets = getTargetsOrdered();
    if (!targets.length) return;
    if (io) io.disconnect();
    
    io = new IntersectionObserver(function(entries) {
      var offset = headerOffset() + 8;
      var candidate = entries
        .filter(function(e) { return e.isIntersecting; })
        .map(function(e) {
          return {
            id: e.target.id,
            dist: Math.abs(e.target.getBoundingClientRect().top - offset),
            ratio: e.intersectionRatio
          };
        })
        .sort(function(a, b) { return a.dist - b.dist; })[0];
        
      if (candidate && candidate.id) {
        function hrefForId(id) {
          return id === 'reels' ? '#inicio' : '#' + id;
        }
        setActiveByHref(hrefForId(candidate.id));
      }
    }, {
      root: null,
      rootMargin: '-' + headerOffset() + 'px 0px -55% 0px',
      threshold: [0.05, 0.15, 0.3, 0.5, 0.7]
    });
    
    targets.forEach(function(t) { io.observe(t); });
  }

  function init() {
    var initialHash = window.location.hash || '#inicio';
    setActiveByHref(initialHash);
    if (window.location.hash) smoothScrollTo(window.location.hash);
    createObserver();
    computeActiveByScroll();
  }

  window.addEventListener('load', init);
  window.addEventListener('scroll', function() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    computeActiveByScroll();
  }, { passive: true });
  window.addEventListener('resize', function() {
    createObserver();
    computeActiveByScroll();
  }, { passive: true });
});
