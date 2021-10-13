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
            <button id="${respQuestionario[0].id}" onclick="fazerQuestionario(this.id, ${respQuestionario[0].experiencia})">Questionario + ${respQuestionario[0].experiencia}xp</button>
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

// ======================Questionario - funcionalidade=================

// ===============Variaveis necessarias===================
var numeroPergunta = 1;
var acertos = 0;
var perguntas;
var experiencia = 0;

// ======================Iniciando questionario====================
async function fazerQuestionario(id, totalXp){
    experiencia = totalXp;
    acertos = 0;
    numeroPergunta = 1
    carregamento();
    perguntas = await buscarPerguntasQuestionario(id);
    pararCarregamento();
    document.getElementById('containerQuestionario').style.display = 'flex';
    mostrarPergunta(perguntas);
}

// ============================Mostrar Pergunta - Modal==================
function mostrarPergunta() {
    // <span><p>Acertos: ${acertos}</p></span>
    document.getElementById('perguntas').innerHTML = `
        <div id="cabecalhoCartao">
            <span><p>${numeroPergunta}/5</p></span>
            <button onclick="fecharQuestionario()" id="sairQuestionario">Sair</button>
        </div>
        <div id="conteudoQuestionario">
            <div id="pergunta">
                <p>${perguntas[numeroPergunta-1].pergunta}</p>
            </div>
            <div id="alternativas">
                <div class="grupo">
                    <button id="${perguntas[numeroPergunta-1].id}" onclick="verificarResposta(this, ${perguntas[numeroPergunta-1].idQuestionario})">${perguntas[numeroPergunta-1].a}</button>
                    <button id="${perguntas[numeroPergunta-1].id}" onclick="verificarResposta(this, ${perguntas[numeroPergunta-1].idQuestionario})">${perguntas[numeroPergunta-1].b}</button>
                </div>
                <div class="grupo">
                    <button id="${perguntas[numeroPergunta-1].id}" onclick="verificarResposta(this, ${perguntas[numeroPergunta-1].idQuestionario})">${perguntas[numeroPergunta-1].c}</button>
                    <button id="${perguntas[numeroPergunta-1].id}" onclick="verificarResposta(this, ${perguntas[numeroPergunta-1].idQuestionario})">${perguntas[numeroPergunta-1].d}</button>
                </div>
            </div>
        </div>
    `;
}

// ====================Correcao de resposta/Avancar para proxima pergunta=====================
async function verificarResposta(resposta, idQuestionario) {
    carregamento();
    const respPerguntas = await buscarPerguntasQuestionario(idQuestionario);
    for(let x = 0; x < respPerguntas.length; x++) {
        if(respPerguntas[x].id == resposta.id) {
            if(respPerguntas[x].correta == resposta.innerHTML) {
                acertos++;
            }
        }
    }
    if(numeroPergunta<5) {
        numeroPergunta++;
        mostrarPergunta();
    } else {
        mostrarResultadoQuestionario(idQuestionario);
    }
    pararCarregamento();
}

// ==============================Opcao sair do questionario=================
function fecharQuestionario() {
    document.getElementById('perguntas').innerHTML = '';
    document.getElementById('containerQuestionario').style.display = 'none';
}


// ==========================Finalizacao de questionario===============
async function mostrarResultadoQuestionario(idQuestionario) {
    carregamento();
    var ipUsuario = await pegarIp();
    var apelido = pegarCookies('apelido');
    await cadastrarResultado(idQuestionario, acertos);
    if(acertos>=3) {
        alert("Voce passou")
        alert("Voce ganhou ", experiencia, " experiencia")
        await ganhaExperiencia(ipUsuario, apelido, experiencia);
    } else {
        alert("Voce reprovou")
    }
    pararCarregamento();
    fecharQuestionario();
}