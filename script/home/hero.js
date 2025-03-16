function initializeCarousel() {
  const track = document.querySelector(".carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".carousel-indicators button");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");

  if (!track || !items.length || !prevButton || !nextButton) {
    console.error("Carousel elements not found");
    return;
  }

  let currentIndex = 0;
  let slideCount = items.length;
  let slidesToShow = window.innerWidth >= 1024 ? 3 : 1;
  let slidesToScroll = 1;
  let intervalId;

  updateCarousel();
  startAutoSlide();

  window.addEventListener("resize", function () {
    const newSlidesToShow = window.innerWidth >= 1024 ? 3 : 1;
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      updateCarousel();
    }
  });

  function updateCarousel() {
    const itemWidth = 100 / slidesToShow;
    const translateValue = currentIndex * -itemWidth;

    items.forEach((item) => {
      item.style.width = `${itemWidth}%`;
    });

    track.style.transform = `translateX(${translateValue}%)`;

    indicators.forEach((indicator, index) => {
      if (index === Math.floor(currentIndex / slidesToScroll)) {
        indicator.classList.remove("bg-gray-300");
        indicator.classList.add("bg-indigo-900");
      } else {
        indicator.classList.remove("bg-indigo-900");
        indicator.classList.add("bg-gray-300");
      }
    });
  }

  function nextSlide() {
    const maxIndex = slideCount - slidesToShow;
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + slidesToScroll;
    updateCarousel();
  }

  function prevSlide() {
    const maxIndex = slideCount - slidesToShow;
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - slidesToScroll;
    updateCarousel();
  }

  function startAutoSlide() {
    stopAutoSlide();
    intervalId = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    prevSlide();
    startAutoSlide();
  });

  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    nextSlide();
    startAutoSlide();
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentIndex = index * slidesToScroll;
      updateCarousel();
      startAutoSlide();
    });
  });

  track.parentElement.addEventListener("mouseenter", stopAutoSlide);
  track.parentElement.addEventListener("mouseleave", startAutoSlide);
}

document.addEventListener('heroScriptLoaded', initializeCarousel);
if (document.readyState === 'complete') {
  initializeCarousel();
}

