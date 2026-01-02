// ========================================
// NAVBAR.JS - Funcionalidad del menú
// ========================================

function initNavbar() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navbarMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        });
    }
    
    // Marcar enlace activo basado en la URL actual
    markActiveLink();
}

function markActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Si es la página de comunidad
        if (href === 'comunidad.html' && currentPage === 'comunidad.html') {
            link.classList.add('active');
        }
        // Si es index.html o una sección con hash
        else if (href === 'index.html' && currentPage === 'index.html' && !currentHash) {
            link.classList.add('active');
        }
        else if (href.includes('#') && href.endsWith(currentHash)) {
            link.classList.add('active');
        }
    });
}

// Actualizar enlace activo cuando cambia el hash
window.addEventListener('hashchange', markActiveLink);