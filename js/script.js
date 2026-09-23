async function carregarEquipe() {
    const container = document.getElementById('teamContainer');

    if (!container) return;

    const response = await fetch('./JSON/equipe.json');

    if (!response.ok) {
        throw new Error(`Não foi possível carregar equipe.json: ${response.status}`);
    }

    const data = await response.json();

    data.equipe.forEach(pessoa => {
        const card = document.createElement('div');
        card.classList.add('card');

        const imagem = pessoa.imagem && pessoa.imagem !== "" ? pessoa.imagem : 'css/assets/default.png';

        card.innerHTML = `
            <div class="image">
                <img src="${imagem}" alt="${pessoa.nome}">
            </div>
            <div class="info">
                <h3>${pessoa.nome}</h3>
                <p class="specialty"><strong>${pessoa.especialidade_desejada}</strong></p>
                <a onclick="verPerfil(${pessoa.id})" class="btn">Ver perfil completo ></a>
            </div>
        `;

        container.appendChild(card);
    });
}

function verPerfil(id) {
    window.location.href = `teamPage/member.html?id=${id}`;
}

function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function carregarMembro() {
    const id = getIdFromURL();

    const response = await fetch('./../JSON/equipe.json');

    if (!response.ok) {
        throw new Error(`Não foi possível carregar equipe.json: ${response.status}`);
    }

    const data = await response.json();

    const membro = data.equipe.find(m => m.id == id);

    if (!membro) return;

    preencherTela(membro);
}

function preencherTela(membro) {
    document.getElementById("imagem").src = "./../" + membro.imagem;
    document.getElementById("nome").innerText = membro.nome;
    document.getElementById("especialidade").innerText =
        "Especialidade desejada: " + membro.especialidade_desejada;

    const idade = calcularIdade(membro.data_nascimento);
    document.getElementById("idade").innerText =
        idade === "?" ? "Idade: ?" : idade + " anos";

    document.getElementById("sobre").innerText = membro.sobre;
    document.getElementById("expectativas").innerText = membro.expectativas;
    document.getElementById("desafios").innerText = membro.medos_e_desafios;
    document.getElementById("motivacoes").innerText = membro.motivacoes;
}

if (window.location.pathname.includes("member.html")) {
    carregarMembro();
}

function getRelatoIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
}

async function carregarRelatos() {
    const container = document.getElementById("relatosContainer");

    if (!container) return;

    const response = await fetch("./../JSON/relatos.json");

    if (!response.ok) {
        throw new Error(`Não foi possível carregar relatos.json: ${response.status}`);
    }

    const data = await response.json();

    data.relatos.forEach(relato => {
        const card = document.createElement("article");
        card.classList.add("relatosCard");

        const semana = document.createElement("span");
        semana.classList.add("relatoWeek");
        semana.textContent = relato.semana;

        const titulo = document.createElement("h2");
        titulo.textContent = relato.titulo;

        const subtitulo = document.createElement("p");
        subtitulo.textContent = relato.subtitulo;

        const link = document.createElement("a");
        link.classList.add("relatoBtn");
        link.href = `./relato.html?id=${relato.id}`;
        link.textContent = "Ler Relato Completo";

        card.append(semana, titulo, subtitulo, link);
        container.appendChild(card);
    });
}

if (document.getElementById("relatosContainer")) {
    carregarRelatos();
}

async function carregarRelato() {
    const response = await fetch('./../JSON/relatos.json');

    if (!response.ok) {
        throw new Error(`Não foi possível carregar relatos.json: ${response.status}`);
    }

    const data = await response.json();
    const relato = data.relatos.find(item => item.id === getRelatoIdFromURL());

    if (!relato) {
        document.getElementById("relatoTitulo").innerText = "Relato não encontrado";
        document.getElementById("relatoConteudo").innerHTML = "<p>Não foi possível encontrar esse relato.</p>";
        return;
    }

    document.title = relato.titulo;
    document.getElementById("relatoSemana").innerText = relato.semana;
    document.getElementById("relatoTitulo").innerText = relato.titulo;
    document.getElementById("relatoSubtitulo").innerText = relato.subtitulo;
    const imagens = document.getElementById("relatoImagens");

    relato.imagens?.forEach((caminho, indice) => {
        const imagem = document.createElement("img");
        imagem.src = `./../${caminho}`;
        imagem.alt = `Imagem ${indice + 1} do relato: ${relato.subtitulo}`;
        imagens.appendChild(imagem);
    });

    document.getElementById("relatoConteudo").innerHTML = relato.conteudo
        .map(paragrafo => `<p>${paragrafo}</p>`)
        .join("");
}

if (window.location.pathname.includes("relato.html")) {
    carregarRelato();
}

function calcularIdade(dataNascimento) {
    if (!dataNascimento || dataNascimento === "?") return "?";

    const [dia, mes, ano] = dataNascimento.split("/");
    const hoje = new Date();
    const nascimento = new Date(ano, mes - 1, dia);

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();

    if (
        mesAtual < nascimento.getMonth() ||
        (mesAtual === nascimento.getMonth() && diaAtual < nascimento.getDate())
    ) {
        idade--;
    }

    return idade;
}

if (document.getElementById("teamContainer")) {
    carregarEquipe();
}