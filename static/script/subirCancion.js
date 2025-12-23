let currentUser = localStorage.getItem("currentUser");

document.addEventListener("DOMContentLoaded", () => {
    if (!currentUser) {
        alert("No has iniciado sesión. Serás redirigido al login.");
        window.location.href = "/";
        return;
    }

    const uploadBtn = document.getElementById("upload-btn");
    if (uploadBtn) uploadBtn.addEventListener("click", uploadSongFile);

    const uploadUrlBtn = document.getElementById("upload-url-btn");
    if (uploadUrlBtn) uploadUrlBtn.addEventListener("click", uploadSongFromUrl);

    const downloadUrlBtn = document.getElementById("download-url-btn");
    if (downloadUrlBtn) downloadUrlBtn.addEventListener("click", downloadSongFromUrlLocal);

    const backBtn = document.getElementById("back-menu");
    if (backBtn) backBtn.addEventListener("click", () => window.location.href = "/menu");
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
            messageDiv.textContent = data.detail || "Error al subir.";
        }
    } catch (error) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Error de conexión con el servidor.";
    }
}

async function uploadSongFromUrl() {
    const urlInput = document.getElementById("song-url");
    const messageDiv = document.getElementById("upload-url-message");
    const url = urlInput.value.trim();

    if (!url) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Pega un enlace válido.";
        return;
    }

    const formData = new FormData();
    formData.append("username", currentUser);
    formData.append("url", url);

    messageDiv.style.color = "#ffffff";
    messageDiv.textContent = "Guardando en tu nube...";

    try {
        const response = await fetch("/upload-song-url", { method: "POST", body: formData });
        const data = await response.json();

        if (response.ok && data.success) {
            messageDiv.style.color = "#1DB954";
            messageDiv.textContent = "¡Guardada en tu nube con éxito!";
            urlInput.value = "";
        } else {
            messageDiv.style.color = "#ff6b6b";
            messageDiv.textContent = data.detail || "Error al procesar la URL.";
        }
    } catch (error) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Error de conexión.";
    }
}

async function downloadSongFromUrlLocal() {
    const urlInput = document.getElementById("song-url");
    const messageDiv = document.getElementById("upload-url-message");
    const url = urlInput.value.trim();

    if (!url) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Pega un enlace para descargar al PC.";
        return;
    }

    messageDiv.style.color = "#ffffff";
    messageDiv.textContent = "Preparando audio...";

    try {
        const formData = new FormData();
        formData.append("url", url);

        const response = await fetch("/download-song-url", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            let errorMessage = "Error en el servidor";
            try {
                const errorJson = await response.json();
                errorMessage = errorJson.detail || errorMessage;
            } catch (e) {
                errorMessage = `Error ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        const blob = await response.blob();
        let filename = "cancion.mp3";
        const disposition = response.headers.get('Content-Disposition');

        if (disposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
            }
        }

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        }, 100);

        messageDiv.style.color = "#1DB954";
        messageDiv.textContent = "¡Descarga completada!";
        urlInput.value = "";

    } catch (error) {
        console.error(error);
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = error.message;
    }
}