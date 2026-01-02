// ========================================
// NAVBAR.JS - Funcionalidad del menú
// ========================================

function initNavbar() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menú móvil
    if (mobileToggle && navbarMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        });
    }

    // Detectar sección activa al hacer scroll
    initScrollSpy();
}

// ========================================
// SCROLL SPY - Resaltar enlace activo
// ========================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        let scrollPosition = window.scrollY + 100; // Offset para activar antes

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remover clase active de todos los enlaces
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Agregar clase active al enlace correspondiente
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });

        // Si estamos en el top de la página, activar "Inicio"
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href="#inicio"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }

    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Ejecutar inmediatamente
}