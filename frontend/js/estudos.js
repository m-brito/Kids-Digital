window.onload = function() {
    populaConteudos();
    // var proximoNivel = Math.pow((nivel + 1) * 4, 2)

    // ===================Botoes Cabecalho======================

    document.getElementById('btnMeuHeroi').addEventListener('click', () => {
        console.log('meu heroi')
    })
    document.getElementById('btnSair').addEventListener('click', () => {
        console.log('Sair')
    })
    document.getElementById('verRanking').addEventListener('click', () => {
        console.log('Ver ranking')
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