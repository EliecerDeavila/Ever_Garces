(function() {
  var strip = document.getElementById('slider-strip');
  if (!strip) return;
  
  var slides = Array.from(strip.children);
  var total = slides.length;
  var index = 0;
  var dots = Array.from(document.querySelectorAll('.slider-dot'));

  var videoEndedHandlers = new WeakMap();

  function goTo(i) {
    index = (i + total) % total;
    strip.style.transform = 'translateX(-' + (index * 100) + '%)';
    updateDots();
    handleVideoPlayback();
  }

  function updateDots() {
    dots.forEach(function(d, di) {
      var active = di === index;
      d.classList.remove('bg-white', 'ring-white/70', 'bg-white/40', 'ring-white/50', 'hover:bg-white/70');
      if (active) {
        d.classList.add('bg-white', 'ring-white/70');
      } else {
        d.classList.add('bg-white/40', 'ring-white/50', 'hover:bg-white/70');
      }
    });
  }

  function handleVideoPlayback() {
    slides.forEach(function(slide, si) {
      var video = slide.querySelector('video');
      if (!video) return;
      
      if (video.hasAttribute('loop')) video.removeAttribute('loop');
      
      var prevHandler = videoEndedHandlers.get(video);
      if (prevHandler) {
        video.removeEventListener('ended', prevHandler);
        videoEndedHandlers.delete(video);
      }
      
      if (si === index) {
        try { video.currentTime = Math.min(video.currentTime || 0, video.duration || 0); } catch (err) {}
        
        var onEnded = function() { goTo(index + 1); };
        video.addEventListener('ended', onEnded);
        videoEndedHandlers.set(video, onEnded);
        
        // Intentar reproducir (los videos están muted)
        try {
          var p = video.play();
          if (p && typeof p.catch === 'function') p.catch(function() {});
        } catch (err) {}
        
        if (Number.isFinite(video.duration) && video.duration > 0 && (video.duration - video.currentTime) < 0.2) {
          setTimeout(function() { goTo(index + 1); }, 0);
        }
      } else {
        try { video.pause(); } catch (err) {}
        try { video.currentTime = 0; } catch (err) {}
      }
    });
  }

  dots.forEach(function(d, di) {
    d.addEventListener('click', function() { goTo(di); });
  });

  window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  var viewport = strip.parentElement;
  var startX = 0;
  var isDown = false;
  
  if (viewport) {
    viewport.addEventListener('pointerdown', function(e) {
      isDown = true;
      startX = e.clientX;
    });
    viewport.addEventListener('pointerup', function(e) {
      if (!isDown) return;
      isDown = false;
      var dx = e.clientX - startX;
      if (dx > 50) goTo(index - 1);
      if (dx < -50) goTo(index + 1);
    });
    viewport.addEventListener('pointerleave', function() { isDown = false; });

    var ioSlider = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
          slides.forEach(function(sl) {
            var v = sl.querySelector('video');
            if (v) v.pause();
          });
        } else {
          handleVideoPlayback();
        }
      });
    }, { threshold: 0.25 });
    
    ioSlider.observe(viewport);
  }

  updateDots();
  handleVideoPlayback();

  slides.forEach(function(slide, si) {
    var video = slide.querySelector('video');
    if (!video) return;
    
    video.addEventListener('error', function() {
      if (si === index) goTo(index + 1);
    });
  });
})();
