// ========================================
// THEME.JS - Modo oscuro/claro
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Verificar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Esperar a que se cargue el navbar para inicializar el botón
    waitForNavbar();
});

function waitForNavbar() {
    const observer = new MutationObserver(() => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            // Remover event listeners anteriores (si existen)
            themeToggle.replaceWith(themeToggle.cloneNode(true));
            
            // Obtener el nuevo botón
            const newThemeToggle = document.getElementById('theme-toggle');
            
            // Agregar event listener
            newThemeToggle.addEventListener('click', toggleTheme);
            
            console.log('✅ Theme toggle inicializado');
            observer.disconnect();
        }
    });

    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        observer.observe(navbarContainer, { childList: true, subtree: true });
    }
}

function toggleTheme() {
    console.log('🎨 Toggle theme clicked');
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