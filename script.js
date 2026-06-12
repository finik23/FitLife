document.addEventListener("DOMContentLoaded", () => {

    const btn = document.querySelector(".menu-toggle");
    const menu = document.querySelector("#menu");

    // Abrir/cerrar menú móvil
    if (btn && menu) {
        btn.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll("#menu a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
        });
    });

    // Botón salir
    const salir = document.querySelector("#salir");

    if (salir) {
        salir.addEventListener("click", (e) => {
            e.preventDefault();

            const confirmar = confirm("¿Quieres salir de FitLife?");

            if (confirmar) {
                window.location.href = "salir.html";
            }
        });
    }

});

self.addEventListener("install", () => {
    console.log("Service Worker instalado");
});