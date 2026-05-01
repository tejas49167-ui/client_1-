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

function initProductSearch() {
  const searchInput = document.querySelector("[data-product-search]");
  const productGrid = document.querySelector("[data-product-grid]");

  if (!searchInput || !productGrid) {
    return;
  }

  const cards = [...productGrid.querySelectorAll("[data-product-card]")];
  const emptyState = document.querySelector("[data-product-empty]");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = (card.dataset.productSearchText || card.textContent).toLowerCase();
      const isVisible = text.includes(query);
      card.hidden = !isVisible;
      visibleCount += isVisible ? 1 : 0;
    });

    emptyState?.classList.toggle("hidden", visibleCount > 0);
  });
}

initProductSearch();
