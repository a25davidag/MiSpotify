let currentUser = localStorage.getItem("currentUser") || null;
let currentSongs = [];
let currentSongIndex = 0;

const audioPlayer = document.getElementById("audio-player");

document.addEventListener("DOMContentLoaded", async () => {
    if (!currentUser) {
        window.location.href = "/";
        return;
    }

    try {
        const response = await fetch(`/songs?username=${currentUser}`);
        const data = await response.json();
        currentSongs = data.songs || [];
        renderSongList(); // no reproduce nada al entrar
    } catch (error) {
        console.error(error);
        alert("Error al cargar las canciones");
    }

    document.getElementById("prev-song").addEventListener("click", anteriorCancion);
    document.getElementById("next-song").addEventListener("click", siguienteCancion);
    document.getElementById("back-menu").addEventListener("click", backToMenu);
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

function playSong(songName) {
    currentSongIndex = currentSongs.indexOf(songName);
    if (currentSongIndex === -1) currentSongIndex = 0;

    const encodedSong = encodeURIComponent(songName);
    audioPlayer.src = `/play/${currentUser}/${encodedSong}`;
    audioPlayer.play();
}

function siguienteCancion() {
    if (currentSongs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
    playSong(currentSongs[currentSongIndex]);
}

function anteriorCancion() {
    if (currentSongs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
    playSong(currentSongs[currentSongIndex]);
}

function backToMenu() {
    window.location.href = "/menu";
}

audioPlayer.addEventListener("ended", () => {
    siguienteCancion();
});
