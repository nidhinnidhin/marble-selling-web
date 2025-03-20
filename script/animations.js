document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer options
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1 // trigger when 10% of the element is visible
    };
  
    // Function to handle animation based on direction
    function animateElement(element, direction = 'up', delay = 0) {
      // Remove any existing classes first
      element.classList.remove('animate-from-left', 'animate-from-right', 'animate-from-bottom');
      
      // Add opacity-0 and appropriate transform class if not already animated
      if (!element.classList.contains('animated')) {
        element.classList.add('opacity-0');
        
        switch(direction) {
          case 'left':
            element.classList.add('transform-left');
            break;
          case 'right':
            element.classList.add('transform-right');
            break;
          case 'up':
          default:
            element.classList.add('transform-up');
            break;
        }
        
        // Force a reflow to ensure the initial state is applied
        void element.offsetWidth;
        
        // Apply animation with delay
        setTimeout(() => {
          element.classList.add('animated');
          element.classList.remove('opacity-0', 'transform-left', 'transform-right', 'transform-up');
        }, delay);
      }
    }
  
    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const direction = element.dataset.animateFrom || 'up';
          const delay = parseInt(element.dataset.delay || 0);
          
          animateElement(element, direction, delay);
          
          // Stop observing after animation
          observer.unobserve(element);
        }
      });
    }, observerOptions);
  
    // Helper function to setup sections with alternating animations
    function setupSectionAnimations(sectionSelector, childSelector, startDirection = 'left') {
      const sections = document.querySelectorAll(sectionSelector);
      
      sections.forEach(section => {
        const elements = section.querySelectorAll(childSelector);
        let direction = startDirection;
        
        elements.forEach((element, index) => {
          // Set data attributes for animation
          element.dataset.animateFrom = direction;
          element.dataset.delay = index * 100; // stagger by 100ms
          
          // Alternate direction if needed
          if (startDirection !== 'up') {
            direction = direction === 'left' ? 'right' : 'left';
          }
          
          // Observe element
          observer.observe(element);
        });
      });
    }
  
    // Apply Animations to Hero Section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const heroElements = heroContent.children;
      Array.from(heroElements).forEach((el, index) => {
        el.dataset.animateFrom = 'up';
        el.dataset.delay = index * 150;
        observer.observe(el);
      });
    }
  
    // Production Process Section
    setupSectionAnimations('.production-process', '.process-step', 'left');
  
    // What We Offer Section
    setupSectionAnimations('.services-grid', '.service-item', 'up');
  
    // Discover Our Creation Section
    setupSectionAnimations('#marble-carousel', '.carousel-item', 'up');
  
    // Stone Selection Section
    setupSectionAnimations('.stone-carousel', '.stone-item', 'right');
  
    // About Us Section
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      const leftCol = aboutSection.querySelector('.about-image');
      const rightCol = aboutSection.querySelector('.about-content');
      
      if (leftCol) {
        leftCol.dataset.animateFrom = 'left';
        observer.observe(leftCol);
      }
      
      if (rightCol) {
        rightCol.dataset.animateFrom = 'right';
        observer.observe(rightCol);
        
        // Animate list items with delay
        const listItems = rightCol.querySelectorAll('li');
        listItems.forEach((item, index) => {
          item.dataset.animateFrom = 'right';
          item.dataset.delay = 300 + (index * 100);
          observer.observe(item);
        });
      }
    }
  
    // Contact Section
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      const formSide = contactSection.querySelector('form').parentElement;
      const imageSide = contactSection.querySelector('.contact-image');
      
      if (formSide) {
        formSide.dataset.animateFrom = 'left';
        observer.observe(formSide);
        
        // Form elements
        const formElements = formSide.querySelectorAll('input, textarea, button');
        formElements.forEach((el, index) => {
          el.dataset.animateFrom = 'left';
          el.dataset.delay = 200 + (index * 100);
          observer.observe(el);
        });
      }
      
      if (imageSide) {
        imageSide.dataset.animateFrom = 'right';
        observer.observe(imageSide);
      }
    }
  
    // Carousel functionality
    const initCarousels = () => {
      const carousels = document.querySelectorAll('.carousel-track');
      
      carousels.forEach(carousel => {
        const container = carousel.parentElement;
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = container.parentElement.querySelector('.prev-button');
        const nextBtn = container.parentElement.querySelector('.next-button');
        
        let currentIndex = 0;
        const itemsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        const totalSlides = Math.ceil(items.length / itemsPerView);
        
        const updateCarousel = () => {
          const slideWidth = 100 / itemsPerView;
          carousel.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        };
        
        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : 0;
            updateCarousel();
          });
        }
        
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : totalSlides - 1;
            updateCarousel();
          });
        }
      });
    };
    
    initCarousels();
    
    // Stone carousel automatic slide
    const stoneCarousel = document.querySelector('.stone-carousel > div');
    if (stoneCarousel) {
      let scrollPosition = 0;
      const scrollAmount = 300;
      const maxScroll = stoneCarousel.scrollWidth - stoneCarousel.clientWidth;
      
      setInterval(() => {
        scrollPosition += scrollAmount;
        if (scrollPosition > maxScroll) {
          scrollPosition = 0;
        }
        
        stoneCarousel.style.transform = `translateX(-${scrollPosition}px)`;
      }, 5000); // Auto-scroll every 5 seconds
    }
    
    // Resize handler
    window.addEventListener('resize', initCarousels);
  }); 

  window.addEventListener('load', function() {
    // Hide the loader
    setTimeout(function() {
      document.querySelector('.page-loader').classList.add('loaded');
    }, 500);
    
    // Animate initial elements that are in view
    const initialElements = document.querySelectorAll('[data-animate-from]');
    initialElements.forEach(element => {
      if (isElementInViewport(element)) {
        const direction = element.dataset.animateFrom || 'up';
        const delay = parseInt(element.dataset.delay || 0);
        
        setTimeout(() => {
          element.classList.add('animated');
          element.classList.remove('opacity-0', 'transform-left', 'transform-right', 'transform-up');
        }, delay + 500); // Add 500ms to allow page to settle
      }
    });
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  });