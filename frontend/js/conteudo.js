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
            <button id="${respQuestionario[0].id}" onclick="fazerQuestionario(this.id)">Questionario + ${respQuestionario[0].experiencia}xp</button>
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

function fazerQuestionario(id){
    console.log('Questionario: ', id)
}