function initSlider() {
  const slider = document.querySelector("[data-slider]");

  if (!slider) {
    return;
  }

  const track = slider.querySelector("[data-slider-track]");
  const slides = [...track.children];
  const previous = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  let index = 0;
  let timerId;

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const start = () => {
    stop();
    timerId = window.setInterval(() => show(index + 1), 3500);
  };

  const stop = () => {
    if (timerId) {
      window.clearInterval(timerId);
    }
  };

  previous?.addEventListener("click", () => {
    show(index - 1);
    start();
  });

  next?.addEventListener("click", () => {
    show(index + 1);
    start();
  });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    start();
  }
}

initSlider();
