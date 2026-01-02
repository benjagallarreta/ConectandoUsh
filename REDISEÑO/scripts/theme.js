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
    const observer = new MutationObserver(() => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
            observer.disconnect();
        }
    });

    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        observer.observe(navbarContainer, { childList: true, subtree: true });
    }
});

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Guardar preferencia
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}