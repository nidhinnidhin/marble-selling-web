document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer
    Promise.all([
        fetch("header.html").then(response => response.text()),
        fetch("footer.html").then(response => response.text())
    ]).then(([headerHtml, footerHtml]) => {
        document.getElementById("header").innerHTML = headerHtml;
        document.getElementById("footer").innerHTML = footerHtml;
        
        initializeAnimations();
        initializeTabs();
        initializePagination();
    });
});

function initializeAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.dataset.delay || 0);
                const direction = element.dataset.animateFrom || 'up';

                element.classList.add(`transform-${direction}`);
                
                setTimeout(() => {
                    element.classList.add('animated');
                    element.classList.add('fade-in');
                }, delay);

                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate-from]').forEach(element => {
        animationObserver.observe(element);
    });
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.category-nav button');
    const productGrid = document.querySelector('.product-grid');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('bg-[#30373F]', 'text-white', 'active');
                t.classList.add('text-[#616161]');
            });
            
            // Add active class to clicked tab
            tab.classList.remove('text-[#616161]');
            tab.classList.add('bg-[#30373F]', 'text-white', 'active', 'tab-active');
            
            // Filter products
            const category = tab.textContent.toLowerCase();
            
            // Animate products out
            products.forEach(product => {
                product.classList.add('fade-out');
            });
            
            setTimeout(() => {
                products.forEach(product => {
                    const productCategory = product.dataset.category;
                    if (category === 'all' || productCategory === category) {
                        product.style.display = 'block';
                        product.classList.add('fade-in');
                    } else {
                        product.style.display = 'none';
                    }
                });
            }, 300);
        });
    });
}

function initializePagination() {
    const itemsPerPage = 9;
    const products = Array.from(document.querySelectorAll('.product-card'));
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    
    let currentPage = 1;
    
    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        products.forEach((product, index) => {
            if (index >= start && index < end) {
                product.style.display = 'block';
                product.classList.add('fade-in');
            } else {
                product.style.display = 'none';
            }
        });
        
        // Update pagination buttons
        updatePaginationButtons(page);
    }
    
    function updatePaginationButtons(currentPage) {
        const buttons = pagination.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.remove('bg-[#30373F]', 'text-white');
            if (button.textContent == currentPage) {
                button.classList.add('bg-[#30373F]', 'text-white');
            }
        });
    }
    
    // Initialize pagination
    pagination.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const action = e.target.textContent.toLowerCase();
            
            if (action === 'previous' && currentPage > 1) {
                currentPage--;
            } else if (action === 'next' && currentPage < totalPages) {
                currentPage++;
            } else if (!isNaN(action)) {
                currentPage = parseInt(action);
            }
            
            showPage(currentPage);
        }
    });
    
    // Show first page initially
    showPage(1);
}
