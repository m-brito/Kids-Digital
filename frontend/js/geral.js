var trocarImagem;
var imagens = ["/herois/mulher-maravilha/mulher-maravilha-1.png", "/herois/naruto/naruto-1.png", "/herois/mulher-maravilha/mulher-maravilha-2.png", "/herois/naruto/naruto-2.png", "/herois/mulher-maravilha/mulher-maravilha-3.png", "/herois/naruto/naruto-3.png", "/herois/mulher-maravilha/mulher-maravilha-4.png", "/herois/naruto/naruto-4.png"];
const aplausos = new Audio("/efeitos sonoros/aplausos.mpeg");
const falha = new Audio("/efeitos sonoros/falha.mpeg");
const evoluindo = new Audio("/efeitos sonoros/evoluindo.mpeg");
const musicaQuestionario = new Audio("/efeitos sonoros/musicaQuestionario.mpeg");
aplausos.volume = 0.2;
falha.volume = 0.2;
evoluindo.volume = 0.4;
musicaQuestionario.volume = 0.2;
musicaQuestionario.loop = "loop";

var host = '';

//  ==========Sortear===============
function sorteador(max) {
    return Math.floor(Math.random() * max + 1);
}


// ============Funcoes carregamento================
function carregamento() {
    pararCarregamento();
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
    pararCarregamento();
    document.getElementById('mensagemTela').style.display = 'flex';
    document.getElementById('mensagemTela').innerHTML = `
        <p>${mensagem}</p>
    `;
    setTimeout(() => {
        document.getElementById('mensagemTela').style.display = 'none';
        return;
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

// ==============Procurar Usuario - ID===================
async function procurarUsuarioId(id) {
    const resp = await fetch(`${host}/usuario/get-id?id=${id}`, {
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
// ====================Cadastrar Atinge================
async function cadastrarAtinge(dataAtual, idAtingido, idEfeito, idUsuarioAtacando) {
    await fetch(`${host}/atinge/addAtinge`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "data": dataAtual,
            "idAtingido": idAtingido,
            "idEspecial": idEfeito,
            "idUsuario": idUsuarioAtacando
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
        falha.volume = 0.1;
        aplausos.volume = 0.1;
        evoluindo.play();
        setTimeout(() => {
            falha.volume = 0.2;
            aplausos.volume = 0.2;
        }, 1000);
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

// ===================Data - dd/mm/yyyy========================
function pegarData() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const diaVencimento = parseInt(dia) + 2;
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return(`${dia}/${mes}/${ano}`);
}

// =======================Delete Atinge==============================
async function deleteEfeito(id) {
    try {
        await fetch(`${host}/atinge/delete?id=${id}`, {
            "method": "DELETE"
        })   
    } catch (error) {
        mostrarMensagem('Tivemos problemas de conexao com o servidor!')
    }
}
// =======================Delete efeito de usuario==============================
async function deleteEfeitoDeUsuario(id) {
    try {
        await fetch(`${host}/usuarioefeitos/delete?id=${id}`, {
            "method": "DELETE"
        })   
    } catch (error) {
        mostrarMensagem('Tivemos problemas de conexao com o servidor!')
    }
}
// =======================Efeitos==============================
async function buscarEfeitos() {
    const resp = await fetch(`${host}/efeito/getAll`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}
// =======================Efeitos Usuario==============================
async function buscarEfeitosUsuario(id) {
    const resp = await fetch(`${host}/usuarioefeitos/get-idUsuario?idUsuario=${id}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}
// =======================Efeitos - ID==============================
async function buscarEfeitosId(id) {
    const resp = await fetch(`${host}/efeito/get-id?id=${id}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}
// =======================Efeitos atingidos no usuario==============================
async function buscarEfeitosAtingidos(idUsuario, dataAtual) {
    const resp = await fetch(`${host}/atinge/get-idAtingido?idAtingido=${idUsuario}&data=${dataAtual}`, {
        "method": "GET"
    })
    const data = await resp.json();
    return(data);
}

// ===========================Buscar id Usuario=================================
async function buscarIdUsuario() {
    return await( await(procurarUsuario( pegarCookies('ipUsuario'), pegarCookies('apelido'))))[0].id;
}

// ============================Mensagem de atingido===========================
async function mensagemAtingido() {
    let dataAtual = pegarData();
    let idUsuario = await buscarIdUsuario();
    let efeitosAtingidos = await buscarEfeitosAtingidos(idUsuario, dataAtual);
    if(efeitosAtingidos.length>0) {
        let usuarioAtingiu = await procurarUsuarioId(efeitosAtingidos[0].idUsuario);
        let efeito = await buscarEfeitosId(efeitosAtingidos[0].idEspecial);
        let msgAtingido = pegarCookies("msgatingido");
        if(msgAtingido != pegarData()) {
            mostrarMensagem(`O usuario "${usuarioAtingiu[0].nome}" te atingiu com o efeito "${efeito[0].nome}"!<br><button id="btnMsgAtingido" onclick="naoMostrarMsgAtingido()"><p>Não mostrar mais hoje</p></button>`);
        }
    }
}

function naoMostrarMsgAtingido() {
    document.getElementById('btnMsgAtingido').style.display = 'none';
    document.cookie = `msgatingido=${pegarData()}`;
}

// ==========================Efeito diario===========================
async function efeitoDiario() {
    if(verificarBolsaDiaria() == true) {
        const usuario = pegarCookies('apelido');
        const ipUsuario = pegarCookies('ipUsuario');
        const efeitos = await buscarEfeitos();
        const chance = sorteador(100);
        if(chance > 50) {
            let efeitoSorteado;
            if(efeitos.length <= 1) {
                efeitoSorteado = 0;
            } else {
                efeitoSorteado = sorteador(efeitos.length);
            }
            document.cookie = `bolsadiaria=${data}`;
            cadastrarEfeitoUsuario(efeitos[efeitoSorteado-1].id, usuario, ipUsuario);
            setImgEfeitoDiario();
            mostrarMensagem(`Voce ganhou o efeito "${efeitos[efeitoSorteado-1].nome}", use em alguem no ranking!`)
        } else {
            document.cookie = `bolsadiaria=${data}`;
            const xpGanhou = sorteador(100);
            ganhaExperiencia(ipUsuario, usuario, xpGanhou);
            setImgEfeitoDiario();
            mostrarMensagem(`Voce ganhou ${xpGanhou}Xp. <br> Volte amanha para tentar coletar um efeito especial!`)
        }
    } else {
        mostrarMensagem("Voce ja coletou a bolsa diaria! <br> Volte amanha.")
    }
}

// ====================Cadastrar Efeito para usuario================
async function cadastrarEfeitoUsuario(idEfeito, usuario, ipUsuario) {
    pararCarregamento();
    carregamento();
    const idUsuario = await(await(procurarUsuario(ipUsuario, usuario)))[0].id;
    await fetch(`${host}/usuarioefeitos/add`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "idUsuario": idUsuario,
            "idEfeito": idEfeito
        })
    });
    pararCarregamento();
}

// ========================Verificar se ja coletou bolsa diaria==================
function verificarBolsaDiaria() {
    data = pegarData();
    let feito = pegarCookies('bolsadiaria');
    if(feito == '' || feito == 'undefined' || feito != '' && feito != 'undefined' && feito != data) {
        return true;
    } else {
        return false;
    }
}

// ====================Setar imagem de questionario diario=====================
function setImgEfeitoDiario() {
    if(verificarBolsaDiaria() == true) {
        document.getElementById('imgEfeitoDiario').src = '/imgs/bolsaDiaria.png';
    } else {
        document.getElementById('imgEfeitoDiario').src = '/imgs/bolsaDiariaColetada.png';
    }
}

// ======================Questionario - funcionalidade=================

// ===============Variaveis necessarias===================
var numeroPergunta = 1;
var acertos = 0;
var perguntas;
var experiencia = 0;

// ======================Iniciando questionario====================
async function fazerQuestionario(id, totalXp, funcaoFechar){
    pararCarregamento();
    musicaQuestionario.play();
    experiencia = totalXp;
    acertos = 0;
    numeroPergunta = 1
    carregamento();
    perguntas = await buscarPerguntasQuestionario(id);
    pararCarregamento();
    document.getElementById('containerQuestionario').style.display = 'flex';
    mostrarPergunta(funcaoFechar);
}

// ============================Mostrar Pergunta - Modal==================
function mostrarPergunta(funcaoFechar) {
    carregamento();
    // <span><p>Acertos: ${acertos}</p></span>
    document.getElementById('perguntas').innerHTML = `
        <div id="cabecalhoCartao">
            <span><p>${numeroPergunta}/5</p></span>
            <button onclick="${funcaoFechar}()" id="sairQuestionario">Sair</button>
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
    pararCarregamento();
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
        musicaQuestionario.pause();
        musicaQuestionario.currentTime = 0;
        fecharQuestionario();
        mostrarResultadoQuestionario(idQuestionario);
    }
    pararCarregamento();
}

// ==============================Opcao sair do questionario=================
function fecharQuestionario() {
    musicaQuestionario.pause();
    musicaQuestionario.currentTime = 0;
    document.getElementById('perguntas').innerHTML = '';
    document.getElementById('containerQuestionario').style.display = 'none';
}

// ==============================Opcao sair do questionario diario=================
function fecharQuestionarioDiario() {
    musicaQuestionario.pause();
    musicaQuestionario.currentTime = 0;
    document.cookie = `diario=`;
    setImgQuestionarioDiario();
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

// ============================Usar efeitos===================

async function usarefeitos() {
    var efeitos = await buscarEfeitosAtingidos(await buscarIdUsuario(), pegarData());
    if(efeitos.length>0) {
        let usuarioAtingiu = await procurarUsuarioId(efeitos[0].idUsuario);
        let efeito = await buscarEfeitosId(efeitos[0].idEspecial);
        if(efeito[0].nome === "Congelamento") {
            experiencia = 0;
            return({
                msg: `O usuario "${usuarioAtingiu[0].nome}" te atingiu com o efeito "${efeito[0].nome}"! <br> Voce ganhará 0 de xp`,
                continua: true,
                tempo: 3000
            });
        }
    } else {
        return {
            msg: true,
            continua: true,
            tempo: 0
        };
    }
}

// ======================Mensagem apos execucao questionario=====================
async function mensagemXp() {
    var ipUsuario = await pegarIp();
    var apelido = pegarCookies('apelido');
    let tempo = 0;
    if(acertos>=3) {
        const msg = await usarefeitos()
        if(msg.msg != null) {
            tempo = msg.tempo;
            await mostrarMensagem(msg.msg);
        }
        setTimeout(async () => {
            if(msg.continua == true) {
                aplausos.play();
                document.getElementById('mensagemQuestionarioXp').style.display = 'flex';
                document.getElementById('mensagemQuestionarioXp').style.backgroundColor = '#428eff';
                document.getElementById('mensagemQuestionarioXp').innerHTML = `
                    <p>Voce acertou ${acertos}/5 e passou!</p>
                    <p>+${experiencia}Xp</p>
                `;
                setTimeout(() => {
                    document.getElementById('mensagemQuestionarioXp').style.display = 'none';
                }, 3000);
                await ganhaExperiencia(ipUsuario, apelido, experiencia);
            }
        }, tempo);
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

// =========================Calcular Xp - Questionario Diario=======================
async function calcularXpQuestDiario() {
    const apelido = pegarCookies('apelido');
    const ipUsuario = pegarCookies('ipUsuario');
    const nivelUsuario = await (await procurarUsuario(ipUsuario, apelido))[0].nivel;
    let xpLimite = calculaXpProximoNivel(nivelUsuario);
    mostrarMensagem(`Voce pode ganhar de 10xp à ${xpLimite}Xp`);
    const sorte = sorteador(100);
    if(sorte >= 90) {
        return xpLimite;
    } else if(sorte >=65){
        return Math.floor(xpLimite/3);
    } else {
        return 10;
    }
}

// ========================Verificar se ja fez questionario diario==================
function verificarQuestionarioDiario() {
    data = pegarData();
    let feito = pegarCookies('diario');
    if(feito == '' || feito == 'undefined' || feito != '' && feito != 'undefined' && feito != data) {
        return true;
    } else {
        return false;
    }
}
// ========================Questionario Diario==========================
async function questionarioDiario() {
    carregamento();
    if(verificarQuestionarioDiario() == true) {
        document.cookie = `diario=${data}`;
        const qtde = await pegarConteudos();
        const questSorteado = sorteador(qtde.length-1);
        const xp = await calcularXpQuestDiario();
        setTimeout(() => {
            fazerQuestionario(qtde[questSorteado].idQuestionario, xp, 'fecharQuestionarioDiario');
            setImgQuestionarioDiario();
        }, 3000);
    } else {
        mostrarMensagem('Voce ja fez o questionario diario');
    }
}

// ====================Setar imagem de questionario diario=====================
function setImgQuestionarioDiario() {
    if(verificarQuestionarioDiario() == true) {
        document.getElementById('imgQuestionarioDiario').src = '/imgs/questDiario.png';
    } else {
        document.getElementById('imgQuestionarioDiario').src = '/imgs/questDiarioFeito.png';
    }
}