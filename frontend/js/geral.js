var trocarImagem;
var imagens = ["/herois/mulher-maravilha/mulher-maravilha-1.png", "/herois/naruto/naruto-1.png", "/herois/mulher-maravilha/mulher-maravilha-2.png", "/herois/naruto/naruto-2.png", "/herois/mulher-maravilha/mulher-maravilha-3.png", "/herois/naruto/naruto-3.png", "/herois/mulher-maravilha/mulher-maravilha-4.png", "/herois/naruto/naruto-4.png"];

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
    const resp = await fetch(`https://api64.ipify.org?format=json`, {
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
            mostrarMensagem('Usuario não encontrado!');
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

