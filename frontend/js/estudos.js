window.onload = function() {
    verificarLogin();
    populaConteudos();
    setImgQuestionarioDiario();
    setImgEfeitoDiario();

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
        const usuario = await procurarUsuario(pegarCookies('ipUsuario'), pegarCookies('apelido'));
        let bloqueiaConteudo = Math.floor(usuario[0].nivel/10);
        if(bloqueiaConteudo <=0) {
            bloqueiaConteudo = 1;
        }
        const conteudos = await pegarConteudos();
        pararCarregamento();
        for(let x = 0; x < conteudos.length; x++) {
            if(x+1>bloqueiaConteudo) {
                document.getElementById('materiais').innerHTML += `
                    <button id="${conteudos[x].nome}" onclick="conteudoBloqueado(this.id, ${x+1})" class="conteudoBotaoBloqueado"><img src='/imgs/cadeado-1.png' alt='Conteudo Bloqueado'></button>
                `;
            } else {
                document.getElementById('materiais').innerHTML += `
                    <button id="${conteudos[x].id}" onclick="irConteudo(this.id)" class="conteudoBotao">${conteudos[x].nome}</button>
                `;
            }
        }
    }
}

// ==================Ir para Conteudo=================
function irConteudo(idConteudo) {
    window.location.href = `/conteudo.html?c=${idConteudo}`;
}

function conteudoBloqueado(conteudo, nivel) {
    mostrarMensagem(`O conteudo "${conteudo}" será desbloqueado no nivel ${(nivel)*10}!`);

}