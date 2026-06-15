document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // MENÚ MÓVIL
    // =========================
    const btn = document.querySelector(".menu-toggle");
    const menu = document.querySelector("#menu");

    if (btn && menu) {

        btn.addEventListener("click", () => {
            menu.classList.toggle("active");
        });

        document.querySelectorAll("#menu a").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("active");
            });
        });
    }


    // =========================
    // BOTÓN SALIR
    // =========================
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


    // =========================
    // ELEMENTOS CALCULADORA
    // =========================
    const resetBtn = document.querySelector("#reset");
    const calcularBtn = document.querySelector("#calcular");


    // =========================
    // RESET CALCULADORA
    // =========================
    if (resetBtn) {

        resetBtn.addEventListener("click", () => {

            ["#peso", "#altura", "#edad", "#pesoObjetivo"].forEach(id => {
                const el = document.querySelector(id);
                if (el) el.value = "";
            });

            const sexo = document.querySelector("#sexo");
            const actividad = document.querySelector("#actividad");
            const objetivo = document.querySelector("#objetivo");
            const resultado = document.querySelector("#resultado");

            if (sexo) sexo.value = "hombre";
            if (actividad) actividad.value = "1.2";
            if (objetivo) objetivo.value = "mantener";
            if (resultado) resultado.innerHTML = "";

            // limpiar localStorage
            localStorage.removeItem("caloriasObjetivo");
            localStorage.removeItem("tmb");
            localStorage.removeItem("actividad");
            localStorage.removeItem("ajuste");
            localStorage.removeItem("actividadTexto");
            localStorage.removeItem("ajusteTexto");
        });
    }


    // =========================
    // CALCULAR
    // =========================
    if (calcularBtn) {
        calcularBtn.addEventListener("click", calcularFitness);
    }

});


// =========================
// FUNCIÓN PRINCIPAL
// =========================
function calcularFitness() {

    const pesoEl = document.querySelector("#peso");
    const alturaEl = document.querySelector("#altura");
    const edadEl = document.querySelector("#edad");
    const sexoEl = document.querySelector("#sexo");
    const actividadEl = document.querySelector("#actividad");
    const objetivoEl = document.querySelector("#objetivo");
    const pesoObjEl = document.querySelector("#pesoObjetivo");
    const resultado = document.querySelector("#resultado");

    if (!pesoEl || !alturaEl || !edadEl || !resultado) return;

    const peso = Number(pesoEl.value);
    const altura = Number(alturaEl.value) / 100;
    const edad = Number(edadEl.value);
    const sexo = sexoEl ? sexoEl.value : "hombre";
    const actividad = actividadEl ? Number(actividadEl.value) : 1.2;
    const objetivo = objetivoEl ? objetivoEl.value : "mantener";
    const pesoObjetivo = pesoObjEl ? Number(pesoObjEl.value) : null;


    // =========================
    // VALIDACIÓN
    // =========================
    if (!peso || !altura || !edad) {
        resultado.innerHTML = "<p>Introduce todos los datos obligatorios</p>";
        return;
    }


    // =========================
    // IMC
    // =========================
    const imc = peso / (altura * altura);

    let estado = "";
    if (imc < 18.5) estado = "Bajo peso";
    else if (imc < 25) estado = "Peso saludable";
    else if (imc < 30) estado = "Sobrepeso";
    else estado = "Obesidad";


    // =========================
    // TEXTO ACTIVIDAD
    // =========================
    let actividadTexto = "";

    if (actividad === 1.2) actividadTexto = "Sedentario";
    else if (actividad === 1.375) actividadTexto = "Ligero";
    else if (actividad === 1.55) actividadTexto = "Moderado";
    else if (actividad === 1.725) actividadTexto = "Alto";


    // =========================
    // TEXTO AJUSTE
    // =========================
    let ajusteTexto = "";

    if (objetivo === "perder") {
        ajusteTexto = "Déficit calórico (-500 kcal aprox.)";
    } else if (objetivo === "ganar") {
        ajusteTexto = "Superávit calórico (+300 kcal aprox.)";
    } else {
        ajusteTexto = "Mantenimiento calórico";
    }


    // =========================
    // TMB
    // =========================
    const tmb =
        sexo === "hombre"
            ? (10 * peso) + (6.25 * (altura * 100)) - (5 * edad) + 5
            : (10 * peso) + (6.25 * (altura * 100)) - (5 * edad) - 161;


    // =========================
    // CALORÍAS
    // =========================
    const mantenimiento = tmb * actividad;

    let caloriasObjetivo = mantenimiento;

    if (objetivo === "perder") caloriasObjetivo -= 500;
    if (objetivo === "ganar") caloriasObjetivo += 300;


    // =========================
    // LOCALSTORAGE
    // =========================
    localStorage.setItem("caloriasObjetivo", caloriasObjetivo);
    localStorage.setItem("tmb", tmb);
    localStorage.setItem("actividad", actividad);
    localStorage.setItem("ajuste", caloriasObjetivo - mantenimiento);
    localStorage.setItem("actividadTexto", actividadTexto);
    localStorage.setItem("ajusteTexto", ajusteTexto);


    // =========================
    // OUTPUT
    // =========================
    resultado.innerHTML = `
        <h3>Resultados</h3>

        <p>IMC: ${imc.toFixed(2)}</p>

        <p>Estado: ${estado}</p>

        <p>TMB: ${Math.round(tmb)} kcal/día</p>

        <p>Mantenimiento: ${Math.round(mantenimiento)} kcal/día</p>

        <p><strong>${ajusteTexto}</strong></p>

        <p>Calorías recomendadas: <strong>${Math.round(caloriasObjetivo)}</strong> kcal/día</p>

        <p>Peso objetivo: ${pesoObjetivo || "No indicado"} kg</p>
    `;
}


// =========================
// SERVICE WORKER
// =========================
if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Service Worker registrado"))
        .catch(err => console.log("Error SW:", err));
}


// =========================
// CARGAR STATS INDEX
// =========================
function cargarStats() {

    const calorias = localStorage.getItem("caloriasObjetivo");
    const tmb = localStorage.getItem("tmb");
    const actividadTexto = localStorage.getItem("actividadTexto");
    const ajusteTexto = localStorage.getItem("ajusteTexto");

    const calEl = document.querySelector("#stat-calorias");
    const tmbEl = document.querySelector("#stat-tmb");
    const actEl = document.querySelector("#stat-actividad");
    const adjEl = document.querySelector("#stat-ajuste");

    if (calEl && calorias) calEl.textContent = Math.round(Number(calorias));
    if (tmbEl && tmb) tmbEl.textContent = Math.round(Number(tmb));
    if (actEl && actividadTexto) actEl.textContent = actividadTexto;
    if (adjEl && ajusteTexto) adjEl.textContent = ajusteTexto;
}


// cargar stats al entrar en index
document.addEventListener("DOMContentLoaded", cargarStats);

// actualizar si cambia otra pestaña
window.addEventListener("storage", cargarStats);