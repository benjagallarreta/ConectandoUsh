document.addEventListener("DOMContentLoaded", () => {
    
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
        fetch("../pages/navbar.html") // Asegúrate de que esta ruta sea correcta
            .then(response => response.text())
            .then(data => {
                navbarContainer.innerHTML = data;
            })
            .catch(error => console.error("Error al cargar el navbar:", error));
    }

    
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        fetch("../pages/footer.html") 
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => console.error("Error al cargar el footer:", error));
    }
});