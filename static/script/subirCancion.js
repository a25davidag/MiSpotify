let currentUser = localStorage.getItem("currentUser");

document.addEventListener("DOMContentLoaded", () => {
    if (!currentUser) {
        alert("No has iniciado sesión. Serás redirigido al login.");
        window.location.href = "/";
        return;
    }

    document.getElementById("upload-btn")
        .addEventListener("click", uploadSongFile);

    const urlBtn = document.getElementById("upload-url-btn");
    if (urlBtn) {
        urlBtn.addEventListener("click", uploadSongFromUrl);
        console.log("Botón de URL registrado correctamente");
    }

    document.getElementById("back-menu")
        .addEventListener("click", () => window.location.href = "/menu");
});

async function uploadSongFile() {
    const fileInput = document.getElementById("song-file");
    const messageDiv = document.getElementById("upload-message");

    if (!fileInput.files.length) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Selecciona un archivo MP3 antes de subir.";
        return;
    }

    const file = fileInput.files[0];

    if (!file.name.toLowerCase().endsWith(".mp3")) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Solo se permite subir archivos MP3.";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", currentUser);

    messageDiv.style.color = "#ffffff";
    messageDiv.textContent = "Subiendo canción...";

    try {
        const response = await fetch("/upload-song", { method: "POST", body: formData });
        const data = await response.json();

        if (response.ok && data.success) {
            messageDiv.style.color = "#1DB954";
            messageDiv.textContent = `Archivo '${data.filename}' subido con éxito.`;
            fileInput.value = "";
        } else {
            messageDiv.style.color = "#ff6b6b";
            messageDiv.textContent = data.detail || "Error al subir el archivo.";
        }
    } catch (error) {
        console.error(error);
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Error de conexión con el servidor.";
    }
}

async function uploadSongFromUrl() {
    const urlInput = document.getElementById("song-url");
    const messageDiv = document.getElementById("upload-url-message");

    const url = urlInput.value.trim();

    console.log("BOTÓN PULSADO");
    console.log("currentUser:", currentUser, "URL:", url);

    if (!url) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Pega un enlace válido.";
        return;
    }

    const formData = new FormData();
    formData.append("username", currentUser);
    formData.append("url", url);

    messageDiv.style.color = "#ffffff";
    messageDiv.textContent = "Descargando y convirtiendo canción...";

    try {
        const response = await fetch("/upload-song-url", { method: "POST", body: formData });
        const data = await response.json();

        console.log("Respuesta del servidor:", data);

        if (response.ok && data.success) {
            messageDiv.style.color = "#1DB954";
            messageDiv.textContent = "Canción descargada correctamente.";
            urlInput.value = "";
        } else {
            messageDiv.style.color = "#ff6b6b";
            messageDiv.textContent = data.detail || "Error al descargar la canción.";
        }
    } catch (error) {
        console.error(error);
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Error de conexión con el servidor.";
    }
}

async function uploadSongFromUrl() {
    const urlInput = document.getElementById("song-url");
    const messageDiv = document.getElementById("upload-url-message");

    const url = urlInput.value.trim();

    console.log("BOTÓN PULSADO");
    console.log("currentUser:", currentUser, "URL:", url);

    if (!url) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Pega un enlace válido.";
        return;
    }

    const formData = new FormData();
    formData.append("username", currentUser);
    formData.append("url", url);

    messageDiv.style.color = "#ffffff";
    messageDiv.textContent = "Descargando y convirtiendo canción...";

    try {
        const response = await fetch("/upload-song-url", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        console.log("Respuesta del servidor:", data);

        if (response.ok && data.success) {
            messageDiv.style.color = "#1DB954";
            messageDiv.textContent = "Canción descargada correctamente.";
            urlInput.value = "";
        } else {
            messageDiv.style.color = "#ff6b6b";
            messageDiv.textContent = data.detail || "Error al descargar la canción.";
        }

    } catch (error) {
        console.error(error);
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Error de conexión con el servidor.";
    }
}
