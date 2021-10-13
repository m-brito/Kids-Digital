var trocarImagem;
var imagens = ["/herois/mulher-maravilha/mulher-maravilha-1.png", "/herois/naruto/naruto-1.png", "/herois/mulher-maravilha/mulher-maravilha-2.png", "/herois/naruto/naruto-2.png", "/herois/mulher-maravilha/mulher-maravilha-3.png", "/herois/naruto/naruto-3.png", "/herois/mulher-maravilha/mulher-maravilha-4.png", "/herois/naruto/naruto-4.png"];
const aplausos = new Audio("/efeitos sonoros/aplausos.mpeg");
const falha = new Audio("/efeitos sonoros/falha.mpeg");
aplausos.volume = 0.2;
falha.volume = 0.2;

var host = '';

//  ==========Sortear===============
function sorteador(max) {
    return Math.floor(Math.random() * max + 1);
}


// ============Funcoes carregamento================
function carregamento() {
    document.getElementById('carregamento').style.display = 'flex';
    document.getElementById('carregamento').innerHTML = `
    <div id='divImgCarregamento'>
        <img id='imgCarregamento' src="herois/mulher-maravilha/mulher-maravilha-1.png">
    </div>
        <p>Carregando...</p>
    `;
    trocarImagem = setInterval(() => {
        document.getElementById('imgCarregamento').src = imagens[sorteador(imagens.length-1)]
    }, 5000);
}

function pararCarregamento() {
    document.getElementById('carregamento').style.display = 'none';
    clearInterval(trocarImagem);
}

// ===============Mostrar Mensagem==================
async function mostrarMensagem(mensagem) {
    document.getElementById('mensagemTela').style.display = 'flex';
    document.getElementById('mensagemTela').innerHTML = `
        <p>${mensagem}</p>
    `;
    setTimeout(() => {
        document.getElementById('mensagemTela').style.display = 'none';
    }, 3000);
}

// =============Pegar IP==========
async function pegarIp() {
    const resp = await fetch(`https://api.ipify.org?format=json`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data.ip);
}

// ==============Procurar Usuario - IP e NOME===================
async function procurarUsuario(ip, nome) {
    const resp = await fetch(`${host}/usuario/get-ip?ip=${ip}&nome=${nome}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}

// ==============Procurar Usuario - NOME===================
async function procurarUsuarioNome(nome) {
    const resp = await fetch(`${host}/usuario/get-nome?nome=${nome}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}

// =================Buscar Ranking================
async function buscarRanking() {
    const resp = await fetch(`${host}/usuario/get-ranking`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}

// =================Buscar Conteudo======================
async function buscarConteudoId(id) {
    const resp = await fetch(`${host}/conteudo/get-id?id=${id}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}

// =================Buscar Questionario======================
async function buscarQuestionarioId(id) {
    const resp = await fetch(`${host}/questionario/get-id?id=${id}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}

// =================Buscar Perguntas de Questionario======================
async function buscarPerguntasQuestionario(idQuestionario) {
    const resp = await fetch(`${host}/pergunta/get-idQuestionario?id=${idQuestionario}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}

// =================Buscar Resultado de Questionario-Usuario======================
async function buscarResultadoQuestionario(idQuestionario, idUsuario) {
    const resp = await fetch(`${host}/resultado/get-idUsuarioQuest?idUsuario=${idUsuario}&idQuestionario=${idQuestionario}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}

// ====================Cadastrar Usuario================
async function cadastrarUsuario(ip, nome) {
    await fetch(`${host}/usuario/add`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "ip": ip,
            "nome": nome
        })
    });
}

// =======================Ganhar XP=======================
async function ganhaExperiencia(ip, nome, qtdeExperiencia) {
    const usuario = await procurarUsuario(ip, nome);
    const novaExperiencia = usuario[0].experiencia + qtdeExperiencia;
    let nivel = usuario[0].nivel;
    let proxNivel = calculaXpProximoNivel(nivel);
    while(novaExperiencia >= proxNivel) {
        nivel++;
        proxNivel = calculaXpProximoNivel(nivel);
    }
    await fetch(`${host}/usuario/patch?ip=${ip}&nome=${nome}`, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "nivel": nivel,
            "experiencia": novaExperiencia
        })
    });
}

// =================Cadastrar Resultado=======================
async function cadastrarResultado(idQuestionario, acertos) {
    carregamento();
    var ipUsuario = await pegarIp();
    var apelido = pegarCookies('apelido');
    var usuario = await procurarUsuario(ipUsuario, apelido);
    var existeResultado = await buscarResultadoQuestionario(idQuestionario, usuario[0].id);
    if(existeResultado.length == 0) {
        await fetch(`${host}/resultado/add`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "idUsuario": usuario[0].id,
                "idQuestionario": idQuestionario,
                "acertos": acertos
            })
        });
    } else {
        await fetch(`${host}/resultado/patch?id=${existeResultado[0].id}`, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "acertos": acertos
            })
        });
    }
    pararCarregamento();
}

// =================Pegar Cookies================
function pegarCookies(cookieNome) {
    let nome = cookieNome + "=";
    let decodificarCookie = decodeURIComponent(document.cookie);
    let ca = decodificarCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(nome) == 0) {
        return c.substring(nome.length, c.length);
      }
    }
    return "";
}

// =====================Verifica Login===================
async function verificarLogin() {
    const usuario = pegarCookies('apelido');
    const ipUsuario = pegarCookies('ipUsuario');
    if(usuario == '' || ipUsuario == '' || usuario == undefined || ipUsuario == undefined || usuario == null || ipUsuario == null) {
        mostrarMensagem('Usuario não logado!');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);
    } else {
        const resp = await procurarUsuario(ipUsuario, usuario);
        if(resp.length==0) {
            document.cookie = `apelido=`;
            document.cookie = `ipUsuario=`;
            mostrarMensagem('Usuario não encontrado nesta maquina!');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        }
    }
}

// =================Calcular Niveis===================
function calculaXpProximoNivel(nivelAtual) {
    const proximoNivel = Math.pow((nivelAtual + 1) * 4, 2)
    return proximoNivel;
}

// ==================Parametro URL======================
function parametroUrl(parametro) {
    var url = location.search.substring(1, location.search.length);
    var valorParametro = false;
    var parametros = url.split("&");
    for (i=0; i<parametros.length;i++) {
        nomeParametro = parametros[i].substring(0,parametros[i].indexOf('='));
        if (nomeParametro == parametro) {
            valorParametro = parametros[i].substring(parametros[i].indexOf('=')+1)
        }
    }
    if (valorParametro) {
        return valorParametro;
    }
    else {
        return undefined;
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
        fecharQuestionario();
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
    await cadastrarResultado(idQuestionario, acertos);
    await mensagemXp();
    pararCarregamento();
}

// ======================Mensagem apos execucao questionario=====================
async function mensagemXp() {
    var ipUsuario = await pegarIp();
    var apelido = pegarCookies('apelido');
    console.log(aplausos)
    if(acertos>=3) {
        aplausos.play();
        document.getElementById('mensagemQuestionarioXp').style.display = 'flex';
        document.getElementById('mensagemQuestionarioXp').innerHTML = `
            <p>Voce acertou ${acertos}/5 e passou!</p>
            <p>+${experiencia}Xp</p>
        `;
        setTimeout(() => {
            document.getElementById('mensagemQuestionarioXp').style.display = 'none';
        }, 3000);
        await ganhaExperiencia(ipUsuario, apelido, experiencia);
    } else {
        falha.play();
        document.getElementById('mensagemQuestionarioXp').style.display = 'flex';
        document.getElementById('mensagemQuestionarioXp').style.backgroundColor = '#ff4f4f';
        document.getElementById('mensagemQuestionarioXp').innerHTML = `
            <p>Voce acertou ${acertos}/5 e reprovou!</p>
        `;
        setTimeout(() => {
            document.getElementById('mensagemQuestionarioXp').style.display = 'none';
        }, 3000);
    }
}

