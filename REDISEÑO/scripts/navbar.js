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
    
    // Actualizar enlace activo cuando cambia el hash
    window.addEventListener('hashchange', markActiveLink);
}

function markActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Si estamos en comunidad.html
        if (currentPage === 'comunidad.html') {
            if (href === 'comunidad.html') {
                link.classList.add('active');
            }
        }
        // Si estamos en index.html
        else if (currentPage === 'index.html' || currentPage === '') {
            // Si hay hash en la URL
            if (currentHash) {
                // Marcar activo el enlace que coincida con el hash
                if (href.includes(currentHash)) {
                    link.classList.add('active');
                }
            } else {
                // Si no hay hash, marcar "Inicio" como activo
                if (href === 'index.html') {
                    link.classList.add('active');
                }
            }
        }
    });
}