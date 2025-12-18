let currentUser = null;
let currentSongs = [];
let currentSongIndex = 0;

const audioPlayer = document.getElementById("audio-player");

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

async function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const messageDiv = document.getElementById("register-message");

    const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        messageDiv.style.color = "#1DB954";
        messageDiv.textContent = `Usuario '${username}' registrado con éxito. Ahora inicia sesión.`;
    } else {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = data.detail || "Error al registrar usuario";
    }
}

async function showSongs() {
    if(!currentUser){
    alert("Debes iniciar sesion primero")
    return;
    }
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("songs-section").style.display = "block";

    const response = await fetch("/songs?username=${currenUser}");
    const data = await response.json();

    currentSongs = data.songs;
    currentSongIndex = 0;

    renderSongList();
}

function backToDashboard() {
    document.getElementById("songs-section").style.display = "none";
    document.getElementById("dashboard-section").style.display = "block";

    audioPlayer.pause();
}

function playSong(songName) {
    currentSongIndex = currentSongs.indexOf(songName);
    if (currentSongIndex === -1) currentSongIndex = 0;

    audioPlayer.src = `/media/${songName}.mp3`;
    audioPlayer.play();
}

audioPlayer.addEventListener("ended", () => {
    if (currentSongs.length === 0) return;

    currentSongIndex++;
    if (currentSongIndex >= currentSongs.length) {
        currentSongIndex = 0;
    }
    playSong(currentSongs[currentSongIndex]);
});

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
function siguienteCancion() {
    if (currentSongs.length === 0) return;

    currentSongIndex++;
    if (currentSongIndex >= currentSongs.length) {
        currentSongIndex = 0;
    }
    playSong(currentSongs[currentSongIndex]);
}

function anteriorCancion() {
    if (currentSongs.length === 0) return;

    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = currentSongs.length - 1;
    }
    playSong(currentSongs[currentSongIndex])
}