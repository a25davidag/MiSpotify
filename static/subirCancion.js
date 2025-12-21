let currentUser = localStorage.getItem("currentUser") || null;

document.addEventListener("DOMContentLoaded", () => {
    if (!currentUser) {
        window.location.href = "/";
        return;
    }

    document.getElementById("upload-btn").addEventListener("click", uploadSong);
    document.getElementById("back-menu").addEventListener("click", () => {
        window.location.href = "/menu";
    });
});

async function uploadSong() {
    const fileInput = document.getElementById("song-file");
    const messageDiv = document.getElementById("upload-message");

    if (!fileInput.files.length) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Selecciona un archivo MP3 antes de subir.";
        return;
    }

    const file = fileInput.files[0];
    if (!file.name.endsWith(".mp3")) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Solo se permite subir archivos MP3.";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", currentUser);

    try {
        const response = await fetch("/upload-song", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            messageDiv.style.color = "#1DB954";
            messageDiv.textContent = `Archivo '${data.filename}' subido con éxito.`;
            fileInput.value = "";
        } else {
            messageDiv.style.color = "#ff6b6b";
            messageDiv.textContent = data.detail || "Error al subir el archivo";
        }
    } catch (error) {
        console.error(error);
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Error en el servidor";
    }
}
