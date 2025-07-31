/*oculta senha*/ 
document.getElementById("togglePassword").addEventListener("click", function () {
const password = document.getElementById("password");
const type = password.type === "password" ? "text" : "password";
password.type = type;
});

//login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("loginError");

  //admin fixo
  if (username === "admin" && password === "1234") {
    localStorage.setItem("usuarioLogado", username);
    window.location.href = "dashboard.html";
    return;
  }

  //verifica usuários salvos
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const encontrado = usuarios.find(u => u.usuario === username && u.senha === password);

  if (encontrado) {
    localStorage.setItem("usuarioLogado", username);
    window.location.href = "dashboard.html";
  } else {
    errorMsg.textContent = "Usuário ou senha incorretos.";
  }

});

