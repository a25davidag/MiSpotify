
let currentUser = null;


document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-button");
    if (loginBtn) {
        loginBtn.addEventListener("click", login);
    }


    const registerBtn = document.getElementById("register-button");
    if (registerBtn) {
        registerBtn.addEventListener("click", register);
    }
});


async function login() {
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");
    const messageDiv = document.getElementById("login-message");

    if (!usernameInput || !passwordInput || !messageDiv) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Debes introducir usuario y contraseña antes de entrar";
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            currentUser = username;
            localStorage.setItem("currentUser", currentUser);
            messageDiv.style.color = "#1DB954";
            messageDiv.textContent = `Bienvenido ${currentUser}`;
            // Redirigir al menú
            window.location.href = "/menu";
        } else {
            messageDiv.style.color = "#ff6b6b";
            messageDiv.textContent = data.detail || "Usuario o contraseña incorrectos";
        }
    } catch (error) {
        console.error(error);
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Error en el servidor";
    }
}


async function register() {
    const usernameInput = document.getElementById("register-username");
    const passwordInput = document.getElementById("register-password");
    const messageDiv = document.getElementById("register-message");

    if (!usernameInput || !passwordInput || !messageDiv) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Debes introducir usuario y contraseña para registrarte";
        return;
    }

    try {
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
    } catch (error) {
        console.error(error);
        messageDiv.style.color = "#ff6b6b";
        messageDiv.textContent = "Error en el servidor";
    }
}
