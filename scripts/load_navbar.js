document.addEventListener("DOMContentLoaded", () => {
    // us.html y navbar.html están en la MISMA carpeta: /assets/pages/
    // entonces la ruta del fetch, visto desde us.html, es "./navbar.html"
    fetch("./navbar.html")
        .then(res => {
            if (!res.ok) {
                throw new Error("No se pudo cargar navbar.html: " + res.status);
            }
            return res.text();
        })
        .then(html => {
            const container = document.getElementById("navbar-container");
            if (!container) {
                console.error("No existe el div #navbar-container en el HTML");
                return;
            }
            container.innerHTML = html;
        })
        .catch(err => {
            console.error("Error cargando el navbar:", err);
        });
});
