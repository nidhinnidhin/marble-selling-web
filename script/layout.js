document.addEventListener("DOMContentLoaded", function () {
  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  async function loadComponent(id, file) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        console.error(`${file} not found!`);
        throw new Error(`${file} not found!`);
      }
      const data = await response.text();
      document.getElementById(id).innerHTML = data;

      if (id === "hero") {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = './script/home/hero.js';
          script.onload = () => {
            initializeAnimations();
            const event = new Event('heroScriptLoaded');
            document.dispatchEvent(event);
            resolve();
          };
          document.body.appendChild(script);
        });
      }
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  async function initializeComponents() {
    // Remove loading screen after components are loaded
    const loadingScreen = document.querySelector('.loading-screen');
    
    await loadComponent("header", "./pages/header.html");
    await loadComponent("hero", "./pages/hero.html");
    await loadComponent("footer", "./pages/footer.html");

    // Fade out loading screen
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
    }, 1000);
  }

  function initializeAnimations() {
    // Animate sections on scroll
    gsap.utils.toArray('.section').forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Add hover animations to interactive elements
    const hoverElements = document.querySelectorAll('.hover-animate');
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  initializeComponents();
});

document.addEventListener('heroScriptLoaded', function() {
  // Initialize carousel here if needed
});