const hamburgerBtn = document.getElementById("hamburger-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const logoutBtn = document.getElementById("logout-btn");

let currentUser = localStorage.getItem("currentUser") || null;
document.getElementById("current-user").textContent = currentUser || "Invitado";

// Mostrar/ocultar menú al pulsar hamburguesa
hamburgerBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
});

// Función para navegar a páginas
function goToPage(url) {
    window.location.href = url;
}

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
});

// Placeholders para las demás opciones
function buscarCancionesPrompt() {
    alert("Función de buscar canciones aún no implementada.");
}
function verFavoritas() {
    alert("Función de canciones favoritas aún no implementada.");
}
function crearPlaylistPrompt() {
    alert("Función de crear playlist aún no implementada.");
}
function subirCancionPrompt() {
    alert("Función de subir canción aún no implementada.");
}
