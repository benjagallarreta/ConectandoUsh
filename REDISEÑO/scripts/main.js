// ========================================
// MAIN.JS - Inicialización y carga de componentes
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar Navbar
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        fetch('../pages/navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarContainer.innerHTML = data;
                
                // Inicializar funcionalidad del navbar
                if (typeof initNavbar === 'function') {
                    initNavbar();
                }
                
                // RE-inicializar el theme toggle después de cargar el navbar
                if (typeof initThemeToggle === 'function') {
                    initThemeToggle();
                }
            })
            .catch(error => console.error('Error al cargar navbar:', error));
    }

    // Cargar Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('../pages/footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => console.error('Error al cargar footer:', error));
    }

    // Smooth scroll para los enlaces
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // Efecto de scroll en navbar
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('main-navbar');
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
});