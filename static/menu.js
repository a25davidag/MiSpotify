
let currentUser = localStorage.getItem("currentUser") || null;


document.addEventListener("DOMContentLoaded", () => {
    if (!currentUser) {

        window.location.href = "/";
        return;
    }


    document.getElementById("current-user").textContent = currentUser;

    document.getElementById("btn-canciones").addEventListener("click", irCanciones);
    document.getElementById("btn-buscar").addEventListener("click", irBuscar);
    document.getElementById("btn-favoritas").addEventListener("click", irFavoritas);
    document.getElementById("btn-playlist").addEventListener("click", irPlaylist);
    document.getElementById("btn-subir").addEventListener("click", irSubirCancion);
    document.getElementById("btn-cerrar").addEventListener("click", cerrarSesion);
});


function irCanciones() {
    localStorage.setItem("currentUser", currentUser);
    window.location.href = "/canciones";
}


function irBuscar() {
    alert("Funcionalidad de buscar canciones aún no implementada.");
}
function irFavoritas() {
    alert("Funcionalidad de canciones favoritas aún no implementada.");
}
function irPlaylist() {
    alert("Funcionalidad de crear playlist aún no implementada.");
}
function irSubirCancion() {
    alert("Funcionalidad de subir canción aún no implementada.");
}


function cerrarSesion() {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
}
