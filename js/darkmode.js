const body = document.body;
const toggleBtn = document.getElementById("toggleMode");

if (localStorage.getItem("modo") === "dark") {
  body.classList.replace("light-mode", "dark-mode");
  toggleBtn.textContent = "☀️ Modo Claro";
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");

  const modoAtual = body.classList.contains("dark-mode") ? "dark" : "light";
  toggleBtn.textContent = modoAtual === "dark" ? "☀️ Modo Claro" : "🌙 Modo Escuro";
  localStorage.setItem("modo", modoAtual);
});
