if (!localStorage.getItem("currentUser")) {
    window.location.href = "/";
}

const hamburgerBtn = document.getElementById("hamburger-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const logoutBtn = document.getElementById("logout-btn");

let currentUser = localStorage.getItem("currentUser") || "Invitado";
const userDisplay = document.getElementById("current-user");

if (userDisplay) {
    userDisplay.textContent = currentUser;
}

hamburgerBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
});

function goToPage(url) {
    window.location.href = url;
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
});

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
    window.location.href = "/subir-cancion";
}