let currentUser = null;
let currentPlaylist = null;
let currentSongs = [];       // Lista de canciones actual
let currentSongIndex = 0;    // Índice de la canción que se está reproduciendo

// Referencia al reproductor HTML
const audioPlayer = document.getElementById("audio-player");

// ===== Login =====
async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const messageDiv = document.getElementById("login-message");

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        currentUser = username;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("dashboard-section").style.display = "block";
        document.getElementById("current-user").textContent = currentUser;
    } else {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = data.message;
    }
}

// ===== Registro =====
async function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const messageDiv = document.getElementById("register-message") || document.getElementById("login-message");

    const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        messageDiv.style.color = "#1DB954";
        messageDiv.textContent = `Usuario '${username}' registrado con éxito. ¡Ahora inicia sesión!`;
    } else {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = data.detail || "Error al registrar usuario";
    }
}

// ===== DASHBOARD =====
async function showSongs() {
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("songs-section").style.display = "block";

    const response = await fetch("/songs"); // Endpoint que devuelve todas las canciones
    const data = await response.json();

    currentSongs = data.songs; // Guardamos la lista global
    currentSongIndex = 0;

    renderSongList();
}

function showPlaylists() {
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("playlists-section").style.display = "block";
    document.getElementById("user-playlists").textContent = currentUser;

    loadPlaylists();
}

function backToDashboard() {
    document.getElementById("songs-section").style.display = "none";
    document.getElementById("playlists-section").style.display = "none";
    document.getElementById("dashboard-section").style.display = "block";

    if (audioPlayer) audioPlayer.pause();
}

// ===== Reproducir canción con avance automático =====
function playSong(songName) {
    currentSongIndex = currentSongs.indexOf(songName);
    if (currentSongIndex === -1) currentSongIndex = 0; // Seguridad

    audioPlayer.src = `/media/${songName}.mp3`;
    audioPlayer.play();
}

// Reproducir siguiente canción automáticamente
audioPlayer.addEventListener("ended", () => {
    if (currentSongs.length === 0) return;

    currentSongIndex++;
    if (currentSongIndex >= currentSongs.length) {
        currentSongIndex = 0; // Reinicia lista
    }
    playSong(currentSongs[currentSongIndex]);
});

// Renderizar la lista de canciones
function renderSongList() {
    const list = document.getElementById("songs-list");
    list.innerHTML = "";

    currentSongs.forEach(song => {
        const li = document.createElement("li");
        li.textContent = song;
        li.onclick = () => playSong(song);
        list.appendChild(li);
    });
}

// ===== Playlists =====
async function createPlaylist() {
    const playlistName = document.getElementById("new-playlist-name").value;
    if (!currentUser) return alert("Debes iniciar sesión primero.");

    const response = await fetch("/playlist/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser, playlist_name: playlistName })
    });

    const data = await response.json();
    alert(data.message);
    loadPlaylists();
}

async function loadPlaylists() {
    if (!currentUser) return;

    const response = await fetch(`/playlists/${currentUser}`);
    const data = await response.json();

    const list = document.getElementById("playlists-list");
    list.innerHTML = "";

    data.playlists.forEach(pl => {
        const li = document.createElement("li");
        li.textContent = pl;
        li.onclick = () => loadSongs(pl);
        list.appendChild(li);
    });
}

async function loadSongs(playlistName) {
    currentPlaylist = playlistName;
    document.getElementById("songs-section").style.display = "block";
    document.getElementById("current-playlist").textContent = currentPlaylist;

    const response = await fetch(`/playlist/${currentUser}/${playlistName}`);
    const data = await response.json();

    currentSongs = data.songs;
    currentSongIndex = 0;

    renderSongList();
}
