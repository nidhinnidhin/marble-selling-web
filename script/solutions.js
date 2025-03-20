document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer
    Promise.all([
        fetch("header.html").then(response => response.text()),
        fetch("footer.html").then(response => response.text())
    ]).then(([headerHtml, footerHtml]) => {
        document.getElementById("header").innerHTML = headerHtml;
        document.getElementById("footer").innerHTML = footerHtml;
        
        // Initialize animations after content is loaded
        initializeAnimations();
    });
});

function initializeAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.dataset.delay || 0);

                setTimeout(() => {
                    element.classList.add('animated');
                }, delay);

                // Unobserve after animation
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('[data-animate-from]').forEach(element => {
        animationObserver.observe(element);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
