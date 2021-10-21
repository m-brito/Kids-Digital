window.onload = function() {
    verificarLogin();
    var idConteudo = parametroUrl('c');
    popularConteudo();

    // ==============Escutador imagem - voltar=================
    document.getElementById('voltar').addEventListener('click', () => {
        window.location.href = '/estudos.html';
    });

    // ======================Popular Conteudo=====================
    async function popularConteudo() {
        carregamento();
        const usuario = await procurarUsuario(pegarCookies('ipUsuario'), pegarCookies('apelido'));
        let multiplica = 1;
        if(usuario[0].nivel > 5) {
            multiplica = Math.floor(usuario[0].nivel/10);
        }
        const respConteudo = await buscarConteudoId(idConteudo);
        const respQuestionario = await buscarQuestionarioId(respConteudo[0].idQuestionario);
        if(respConteudo.length > 0) {
            document.getElementById('tituloConteudo').innerHTML = `
                <h1 id="nome">${respConteudo[0].nome}</h1>
            `;
            document.getElementById('videoaula').innerHTML = `
            <iframe src="https://www.youtube.com/embed/${respConteudo[0].url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
            document.getElementById('containerMaterial').innerHTML += `
            <button id="${respQuestionario[0].id}" onclick="fazerQuestionario(this.id, ${respQuestionario[0].experiencia*multiplica}, 'fecharQuestionario')">Questionario + ${respQuestionario[0].experiencia*multiplica}xp</button>
            `;
        } else {
            mostrarMensagem('Conteudo não encontrado!')
            setTimeout(() => {
                window.location.href = '/estudos.html';
            }, 2000)
        }
        pararCarregamento();
    }
}