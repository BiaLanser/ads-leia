//declara uma variável global para armazenar a instância da DataTable
let dataTableLivros = null;
const userLogado = localStorage.getItem("usuarioLogado");

//dom carregado
window.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("usuarioLogado");
  const ul = document.querySelector(".sidebar ul");
  //se o usuário logado for admin, adiciona botões para cadastro
  if (user === "admin") {
    const liLivro = document.createElement("li");
    liLivro.innerHTML = `<button onclick="loadPage('cadastroLivros')">➕ Cadastrar Livro</button>`;
    ul.appendChild(liLivro);

    const liUsuario = document.createElement("li");
    liUsuario.innerHTML = `<button onclick="loadPage('cadastroUsuarios')">➕ Cadastrar Usuário</button>`;
    ul.appendChild(liUsuario);
  }
});

//função para carregar páginas dinamicamente
function loadPage(page) {
  const content = document.getElementById("content");

  if (page === "frases") {
    content.innerHTML = "<h2>Frases Literárias</h2><div id='quoteArea'>Carregando frase...</div>";
    carregarFrase();
  }

//lista de livros
if (page === "livros") {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Acervo</h2>
    <table id="tabelaLivros" class="display">
      <thead>
        <tr>
          <th>Título</th>
          <th>Autor</th>
          <th>Ano</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;
  //inicializa a DataTable e preenche com livros do localStorage
  setTimeout(() => {
    dataTableLivros = $('#tabelaLivros').DataTable({
      destroy: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
      }
    });

    //carrega livros salvos
    const livros = JSON.parse(localStorage.getItem("livros") || "[]");
    livros.forEach(livro => {
      dataTableLivros.row.add([
        livro.titulo,
        livro.autor,
        livro.ano,
        livro.status
      ]).draw();
    });

  }, 0);
}
  

  //cadastro de livros
  else if (page === "cadastroLivros") {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Cadastrar Livro</h2>
    <input type="text" id="buscaTitulo" placeholder="Digite o título do livro" />
    <button style="color: #fff; background: #ff69b4; border: none; border-radius: 4px;" onclick="buscarLivro()">Buscar</button>

    <div id="resultadoLivro" style="margin-top: 20px;"></div>
  `;
  }

  //empréstimos
  else if (page === "emprestimos") {
    const content = document.getElementById("content");
    content.innerHTML = `
      <h2>Empréstimos</h2>

      <form id="formEmprestimo">
        <label>Livro:
          <select id="livroSelecionado" required></select>
        </label>
        <label>Usuário:
          <input type="text" id="usuarioEmprestimo" required />
        </label>
        <label>Data de Devolução:
          <input type="date" id="dataDevolucao" required />
        </label>
        <button type="submit">Registrar Empréstimo</button>
      </form>

      <h3>Lista de Empréstimos</h3>
      <table id="tabelaEmprestimos">
        <thead>
          <tr>
            <th>Livro</th>
            <th>Usuário</th>
            <th>Empréstimo</th>
            <th>Devolução Prevista</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;

    //recupera os empréstimos do localStorage e exibe
    const emprestimosSalvos = JSON.parse(localStorage.getItem("emprestimos") || "[]");
    const tbody = document.querySelector("#tabelaEmprestimos tbody");
    emprestimosSalvos.forEach(e => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.livro}</td>
        <td>${e.usuario}</td>
        <td>${e.dataEmprestimo}</td>
        <td>${e.dataDevolucao}</td>
        <td class="status">${e.status}</td>
        <td>${e.status === "Emprestado" ? "<button onclick='marcarDevolvido(this)'>Devolvido</button>" : ""}</td>
      `;
      tbody.appendChild(tr);
    });


    carregarLivrosDisponiveis();
    document.getElementById("formEmprestimo").addEventListener("submit", registrarEmprestimo);
  }
  
  //cadastro usuário
  else if (page === "cadastroUsuarios") {
    content.innerHTML = `
      <h2>Cadastrar Novo Usuário</h2>
      <form id="formUsuario">
        <label>Usuário:
          <input type="text" id="novoUsuario" required />
        </label>
        <label>Senha:
          <input type="password" id="novaSenha" required />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
      <div id="resultadoCadastro" style="margin-top: 10px;"></div>
    `;

    //salva usuário no localStorage
    document.getElementById("formUsuario").addEventListener("submit", (e) => {
      e.preventDefault();
      const usuario = document.getElementById("novoUsuario").value;
      const senha = document.getElementById("novaSenha").value;

      let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

      if (usuarios.find(u => u.usuario === usuario)) {
        document.getElementById("resultadoCadastro").innerText = "Usuário já existe.";
        return;
      }

      usuarios.push({ usuario, senha });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      document.getElementById("resultadoCadastro").innerText = "Usuário cadastrado com sucesso!";
      document.getElementById("formUsuario").reset();
    });
  }
}

//busca frase na API Ninjas
function carregarFrase() {
  const quoteArea = document.getElementById("quoteArea");
  if (!quoteArea) return; // evita erro se o elemento não estiver carregado

  fetch("https://api.api-ninjas.com/v1/quotes", {
    headers: {
      "X-Api-Key": "o0/E4ov5NO2K0CdO4t8yoA==9CGEs2QqQ44ulkcQ"
    }
  })
    .then(res => res.json())
    .then(data => {
      if (!data || !data[0]) {
        quoteArea.innerText = "Nenhuma frase encontrada.";
        return;
      }

      const quote = data[0];
      quoteArea.innerText = `"${quote.quote}" — ${quote.author}`;
    })
    .catch((err) => {
      console.error("Erro ao carregar frase:", err);
      quoteArea.innerText = "Erro ao carregar frase.";
    });
}

//busca livro na API do Google Books
function buscarLivro() {
  const titulo = document.getElementById("buscaTitulo").value;
  const resultado = document.getElementById("resultadoLivro");
  resultado.innerHTML = "Buscando...";

  fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(titulo)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.items || data.items.length === 0) {
        resultado.innerHTML = "Nenhum livro encontrado.";
        return;
      }

      const livro = data.items[0].volumeInfo;
      resultado.innerHTML = `
        <img src="${livro.imageLinks?.thumbnail || ''}" alt="Capa do livro" />
        <h3>${livro.title || 'Sem título'}</h3>
        <p><strong>Autor:</strong> ${livro.authors?.join(", ") || 'Desconhecido'}</p>
        <p><strong>Descrição:</strong> ${livro.description || 'Sem sinopse disponível.'}</p>
        <button onclick="adicionarLivro('${livro.title}', '${(livro.authors || ['Desconhecido']).join(", ")}', '${livro.publishedDate || '---'}')">Salvar Livro</button>
      `;
    })
    .catch(() => {
      resultado.innerHTML = "Erro ao buscar livro.";
    });
}

//salva um novo livro no localStorage
function adicionarLivro(titulo, autor, ano) {
  const livros = JSON.parse(localStorage.getItem("livros") || "[]");
  livros.push({ titulo, autor, ano, status: "Disponível" });
  localStorage.setItem("livros", JSON.stringify(livros));
  alert("Livro adicionado ao acervo!");
}


//Emprestimos

//carrega livros disponiveis para emprestimo
function carregarLivrosDisponiveis() {
  const select = document.getElementById("livroSelecionado");
  select.innerHTML = "";

  const livros = JSON.parse(localStorage.getItem("livros") || "[]");
  livros.forEach(livro => {
    if (livro.status === "Disponível") {
      const option = document.createElement("option");
      option.value = livro.titulo;
      option.textContent = livro.titulo;
      select.appendChild(option);
    }
  });
}

//novo emprestimo
function registrarEmprestimo(event) {
  event.preventDefault();

  const livro = document.getElementById("livroSelecionado").value;
  const usuario = document.getElementById("usuarioEmprestimo").value;
  const dataEmprestimo = new Date().toLocaleDateString("pt-BR");
  const dataDevolucao = new Date(document.getElementById("dataDevolucao").value);
  dataDevolucao.setDate(dataDevolucao.getDate() + 1); // corrige o bug do "1 dia antes"
  const status = "Emprestado";

  //adiciona na tabela de empréstimos (visualmente)
  const tbody = document.querySelector("#tabelaEmprestimos tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${livro}</td>
    <td>${usuario}</td>
    <td>${dataEmprestimo}</td>
    <td>${dataDevolucao.toLocaleDateString("pt-BR")}</td>
    <td class="status">${status}</td>
    <td><button onclick="marcarDevolvido(this)">Devolvido</button></td>
  `;
  tbody.appendChild(tr);

  //atualiza status do livro no localStorage
  const livros = JSON.parse(localStorage.getItem("livros") || "[]");
  const index = livros.findIndex(l => l.titulo === livro);
  if (index !== -1) {
    livros[index].status = "Emprestado";
    localStorage.setItem("livros", JSON.stringify(livros));
  }

  //salva o empréstimo no localStorage
  const emprestimos = JSON.parse(localStorage.getItem("emprestimos") || "[]");
  emprestimos.push({
    livro,
    usuario,
    dataEmprestimo,
    dataDevolucao: dataDevolucao.toISOString(),
    status
  });
  localStorage.setItem("emprestimos", JSON.stringify(emprestimos));

  carregarLivrosDisponiveis();
  document.getElementById("formEmprestimo").reset();
}

//marca esprestimo como devolvido
function marcarDevolvido(botao) {
  const tr = botao.closest("tr");
  const livro = tr.children[0].textContent;

  //atualiza visualmente
  tr.querySelector(".status").textContent = "Devolvido";
  botao.remove();

  //atualiza status do livro no localStorage
  const livros = JSON.parse(localStorage.getItem("livros") || "[]");
  const indexLivro = livros.findIndex(l => l.titulo === livro);
  if (indexLivro !== -1) {
    livros[indexLivro].status = "Disponível";
    localStorage.setItem("livros", JSON.stringify(livros));
  }

  //atualiza status do empréstimo no localStorage (opcional)
  const emprestimos = JSON.parse(localStorage.getItem("emprestimos") || "[]");
  const indexEmp = emprestimos.findIndex(e => e.livro === livro && e.status === "Emprestado");
  if (indexEmp !== -1) {
    emprestimos[indexEmp].status = "Devolvido";
    localStorage.setItem("emprestimos", JSON.stringify(emprestimos));
  }

  carregarLivrosDisponiveis(); // atualiza o select
}
