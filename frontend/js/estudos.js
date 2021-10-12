window.onload = function() {
    verificarLogin();
    populaConteudos();

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

    // ======================Buscar Conteudos=====================

    async function pegarConteudos() {
        try {
            const resp = await fetch(`${host}/conteudo/get-all`, {
                "method": "GET"
            })
            const data = await resp.json();
            return(data);
        } catch (error) {
            return {"Erro": "Tivemos problemas ao se conectar com o servidor!"}
        }
    }

    // ====================Popular Conteudos=========================
    async function populaConteudos() {
        document.getElementById('materiais').innerHTML += '';
        carregamento();
        const conteudos = await pegarConteudos();
        pararCarregamento();
        for(let x = 0; x < conteudos.length; x++) {
            document.getElementById('materiais').innerHTML += `
                <button id="${conteudos[x].idQuestionario}" onclick="irConteudo(this.id)" class="conteudoBotao">${conteudos[x].nome}</button>
            `;
        }
    }
}

// ==================Ir para Conteudo=================
function irConteudo(idQuestionario) {
    console.log(idQuestionario)
}