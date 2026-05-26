document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("testi-slider");
  const strip = document.getElementById("testi-strip");
  const slides = Array.from(document.querySelectorAll(".testi-slide"));
  const prevBtn = document.getElementById("testi-prev");
  const nextBtn = document.getElementById("testi-next");
  const dots = Array.from(document.querySelectorAll(".testi-dot"));

  if (!slider || !strip || slides.length === 0) return;

  const AUTOPLAY_MS = 5500;
  const LOOP = true;
  const PAUSE_ON_HOVER = true;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;
  let isPaused = false;

  const setTransform = () => {
    strip.style.transform = `translateX(-${index * 100}%)`;
  };

  const setDots = () => {
    if (!dots.length) return;
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.remove("h-3", "w-3", "bg-white/80");
      dot.classList.remove("h-2.5", "w-2.5", "bg-white/30");
      if (active) {
        dot.classList.add("h-3", "w-3", "bg-white/80");
      } else {
        dot.classList.add("h-2.5", "w-2.5", "bg-white/30");
      }
    });
  };

  const goTo = (i) => {
    index = i;
    setTransform();
    setDots();
  };

  const next = () => {
    if (index < slides.length - 1) {
      goTo(index + 1);
    } else if (LOOP) {
      goTo(0);
    } else {
      stopAutoplay();
    }
  };

  const prev = () => {
    if (index > 0) {
      goTo(index - 1);
    } else if (LOOP) {
      goTo(slides.length - 1);
    }
  };

  const startAutoplay = () => {
    if (reducedMotion) return;
    if (timer) return;
    timer = setInterval(() => {
      if (!isPaused) next();
    }, AUTOPLAY_MS);
  };

  const stopAutoplay = () => {
    clearInterval(timer);
    timer = null;
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  goTo(0);
  startAutoplay();

  nextBtn?.addEventListener("click", () => {
    next();
    restartAutoplay();
  });

  prevBtn?.addEventListener("click", () => {
    prev();
    restartAutoplay();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      restartAutoplay();
    });
  });

  if (PAUSE_ON_HOVER) {
    slider.addEventListener("mouseenter", () => (isPaused = true));
    slider.addEventListener("mouseleave", () => (isPaused = false));
    slider.addEventListener("focusin", () => (isPaused = true));
    slider.addEventListener("focusout", () => (isPaused = false));
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  let startX = 0;
  let endX = 0;
  slider.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });
  slider.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
      restartAutoplay();
    }
  }, { passive: true });
});
