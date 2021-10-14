window.onload = function() {
    verificarLogin();
    populaConteudos();
    setImgQuestionarioDiario();

    // ===================Botoes Cabecalho======================

    document.getElementById('btnMeuHeroi').addEventListener('click', () => {
        window.location.href = '/heroi.html';
    })
    document.getElementById('btnSair').addEventListener('click', () => {
        document.cookie = `apelido=`;
        document.cookie = `ipUsuario=`;
        mostrarMensagem('Saindo...');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);
    })
    document.getElementById('verRanking').addEventListener('click', () => {
        window.location.href = '/ranking.html';
    })

    // ====================Popular Conteudos=========================
    async function populaConteudos() {
        document.getElementById('materiais').innerHTML += '';
        carregamento();
        const conteudos = await pegarConteudos();
        pararCarregamento();
        for(let x = 0; x < conteudos.length; x++) {
            document.getElementById('materiais').innerHTML += `
                <button id="${conteudos[x].id}" onclick="irConteudo(this.id)" class="conteudoBotao">${conteudos[x].nome}</button>
            `;
        }
    }
}

// ==================Ir para Conteudo=================
function irConteudo(idConteudo) {
    window.location.href = `/conteudo.html?c=${idConteudo}`;
}