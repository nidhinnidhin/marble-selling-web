document.addEventListener("DOMContentLoaded", function () {
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
    await loadComponent("header", "./pages/header.html");
    await loadComponent("hero", "./pages/hero.html");
    await loadComponent("footer", "./pages/footer.html");
  }

  initializeComponents();
});