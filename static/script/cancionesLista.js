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
        renderSongList();
    } catch (error) {
        console.error(error);
        alert("Error al cargar las canciones");
    }

    document.getElementById("prev-song").addEventListener("click", anteriorCancion);
    document.getElementById("next-song").addEventListener("click", siguienteCancion);
    document.getElementById("back-menu").addEventListener("click", backToMenu);

    audioPlayer.addEventListener("play", () => {
        actualizarMediaSession(currentSongs[currentSongIndex]);
    });
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
    actualizarMediaSession(songName);
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

function actualizarMediaSession(songName) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songName,
            artist: currentUser,
            album: "MiSpotify",
        });

        navigator.mediaSession.setActionHandler('previoustrack', anteriorCancion);
        navigator.mediaSession.setActionHandler('nexttrack', siguienteCancion);
        navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
        navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
    }
}

const visualizer = document.getElementById('audio-visualizer');
const audio = document.getElementById('audio-player');

const barsCount = 30;
for (let i = 0; i < barsCount; i++) {
    const bar = document.createElement('div');
    visualizer.appendChild(bar);
}

// Configuración Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
let source;

audio.addEventListener('play', () => {
    if (!source) {
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
    }
    animateVisualizer();
});

function animateVisualizer() {
    if (audio.paused) return;
    const bars = visualizer.children;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    const maxBarHeight = 60;
    for (let i = 0; i < bars.length; i++) {
        const value = dataArray[i] || 0;
        bars[i].style.height = `${(value / 255) * maxBarHeight}px`;
        bars[i].style.opacity = value / 255;
    }

    requestAnimationFrame(animateVisualizer);
}

