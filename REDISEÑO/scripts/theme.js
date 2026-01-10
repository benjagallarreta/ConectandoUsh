// ========================================
// THEME.JS - Modo oscuro/claro
// ========================================

// PASO 1: Aplicar tema INMEDIATAMENTE (antes de que se cargue todo)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    document.body.classList.add('dark-mode');
}

// PASO 2: Inicializar el botón cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
});

function initThemeToggle() {
    // Intentar inicializar inmediatamente
    let themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        setupThemeToggle(themeToggle);
        console.log('✅ Theme toggle encontrado inmediatamente');
    } else {
        // Si no existe, esperar a que se cargue el navbar
        console.log('⏳ Esperando que se cargue el navbar...');
        waitForNavbar();
    }
}

function waitForNavbar() {
    const observer = new MutationObserver(() => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            setupThemeToggle(themeToggle);
            console.log('✅ Theme toggle inicializado después de cargar navbar');
            observer.disconnect();
        }
    });

    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        observer.observe(navbarContainer, { childList: true, subtree: true });
    }
}

function setupThemeToggle(button) {
    // Remover listeners anteriores clonando el botón
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Agregar el event listener al nuevo botón
    newButton.addEventListener('click', toggleTheme);
}

function toggleTheme(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎨 Toggle theme clicked');
    
    // Toggle en body Y documentElement
    document.documentElement.classList.toggle('dark-mode');
    document.body.classList.toggle('dark-mode');
    
    // Guardar preferencia
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        console.log('💾 Tema oscuro guardado');
    } else {
        localStorage.setItem('theme', 'light');
        console.log('💾 Tema claro guardado');
    }
}