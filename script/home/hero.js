document.addEventListener('heroScriptLoaded', function() {
  // Initialize marble carousel
  initializeCarousel('marble-carousel');
  // Initialize stone carousel
  initializeCarousel('stone-carousel');

  // Add animation classes to elements
  const animatedElements = document.querySelectorAll('[data-animate-from]');
  animatedElements.forEach(element => {
    element.classList.add('opacity-0');
    element.classList.add(`transform-${element.dataset.animateFrom}`);
  });

  // Trigger animations when elements are in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = parseInt(element.dataset.delay || 0);

        setTimeout(() => {
          element.classList.add('animated');
          element.classList.remove('opacity-0', 'transform-left', 'transform-right', 'transform-up');
        }, delay);

        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
});

function initializeCarousel(carouselId) {
  const carouselElement = document.getElementById(carouselId);
  if (!carouselElement) return;

  const carouselTrack = carouselElement.querySelector('.carousel-track');
  const carouselItems = carouselElement.querySelectorAll('.carousel-item');
  const dotsWrapper = carouselElement.querySelector('.carousel-indicators');
  const dotWrappers = dotsWrapper ? dotsWrapper.querySelectorAll('.dot-wrapper') : [];
  const dots = dotsWrapper ? dotsWrapper.querySelectorAll('.dot-wrapper > div') : [];
  const prevButton = carouselElement.querySelector('.prev-button');
  const nextButton = carouselElement.querySelector('.next-button');
  
  let currentIndex = 0;
  let slideCount = carouselItems.length;
  let autoplayInterval;
  let startX;
  let isDragging = false;
  
  function getSlidesToShow() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }
  
  let slidesToShow = getSlidesToShow();
  
  function setSlidesWidth() {
    const width = 100 / slidesToShow;
    carouselItems.forEach(item => {
      item.style.minWidth = `${width}%`;
    });
  }
  
  function updateCarousel(animate = true) {
    if (currentIndex > slideCount - slidesToShow) {
      currentIndex = slideCount - slidesToShow;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    
    const translateX = -(currentIndex * (100 / slidesToShow));
    
    if (animate) {
      carouselTrack.style.transition = 'transform 0.7s ease-out';
    } else {
      carouselTrack.style.transition = 'none';
    }
    
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.classList.toggle('bg-[#E4A853]', index === Math.floor(currentIndex / slidesToShow));
        dot.classList.toggle('bg-gray-200', index !== Math.floor(currentIndex / slidesToShow));
      });
    }
  }

  function goToNext() {
    if (currentIndex < slideCount - slidesToShow) {
      currentIndex++;
      updateCarousel();
    } else {
      currentIndex = 0;
      updateCarousel();
    }
  }

  function goToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    } else {
      currentIndex = slideCount - slidesToShow;
      updateCarousel();
    }
  }

  // Event Listeners
  if (prevButton) prevButton.addEventListener('click', goToPrev);
  if (nextButton) nextButton.addEventListener('click', goToNext);

  dotWrappers.forEach((dotWrapper) => {
    dotWrapper.addEventListener('click', () => {
      const index = parseInt(dotWrapper.getAttribute('data-index'), 10);
      if (!isNaN(index)) {
        currentIndex = index * slidesToShow;
        updateCarousel();
      }
    });
  });

  // Touch and mouse events
  let touchStartX = 0;
  let touchEndX = 0;

  carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  }

  // Initialize
  setSlidesWidth();
  updateCarousel(false);

  // Handle window resize
  window.addEventListener('resize', () => {
    const newSlidesToShow = getSlidesToShow();
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      setSlidesWidth();
      updateCarousel(false);
    }
  });
}