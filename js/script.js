async function carregarEquipe() {
    const response = await fetch('./JSON/equipe.json');
    const data = await response.json();

    const container = document.getElementById('teamContainer');

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

    const relatoContainer = document.getElementById("relato");

    if (membro["2_dia_ubs"] && membro["2_dia_ubs"].length > 0) {
        relatoContainer.innerHTML = membro["2_dia_ubs"]
            .map(paragrafo => `<p>${paragrafo}</p>`)
            .join("");
    } else {
        relatoContainer.innerHTML = "<p>Sem relato disponível.</p>";
    }
}

if (window.location.pathname.includes("member.html")) {
    carregarMembro();
}

function getRelatoIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
}

async function carregarRelato() {
    const response = await fetch('./../JSON/relatos.json');
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