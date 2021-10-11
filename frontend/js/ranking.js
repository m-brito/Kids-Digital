window.onload = function() {
    verificarLogin();
    popularRanking();

    // ==============Escutador imagem - voltar=================
    document.getElementById('voltar').addEventListener('click', () => {
        window.location.href = '/estudos.html';
    })

    // ================Popular Ranking=================
    async function popularRanking() {
        const ipUsuario = pegarCookies('ipUsuario');
        const apelido = pegarCookies('apelido');
        carregamento();
        const respUsuario = await procurarUsuario(ipUsuario, apelido);
        document.getElementById('h1RankingTitulo').innerHTML = `
            Ranking - <strong style="color: #fed22b;">Voce - ${respUsuario[0].experiencia}Xp</strong>
        `;
        try {
            const ranking = await buscarRanking();
            document.getElementById('posicoesRanking').innerHTML = '';
            for(let x = 0; x < ranking.length; x++) {
                if(x < 15) {
                    document.getElementById('posicoesRanking').innerHTML += `
                        <div class="usuarioPlacar">
                            <div class="numeroPosicao"><p>#${x+1}</p></div>
                            <div class="nomeUsuario"><p>${ranking[x].nome} - ${ranking[x].experiencia}Xp</p></div>
                        </div>
                    `;
                } else {
                    break;
                }
            }
        } catch (error) {
            mostrarMensagem('Tivemos problemas de conexao com o servidor!');
        }
        pararCarregamento();
    }
}