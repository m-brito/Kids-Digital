var heroisParaEscolha = ['mulher-maravilha', 'naruto'];

window.onload = function() {
    verificarLogin();
    verificarExistenciaHeroi();

    // ==============Escutador imagem - voltar=================
    document.getElementById('voltar').addEventListener('click', () => {
        window.location.href = '/estudos.html';
    });

    // ====================Verificar Heroi e popular===============

    async function verificarExistenciaHeroi() {
        const ipUsuario = await pegarIp();
        const usuario = pegarCookies('apelido');
        const respUsuario = await procurarUsuario(ipUsuario, usuario);
        if(respUsuario[0].heroi == null) {
            escolherHeroi(ipUsuario, usuario);
        } else {
            const xpProximoNivel = calculaXpProximoNivel(respUsuario[0].nivel);
            populaDadosHeroi(respUsuario[0].experiencia, xpProximoNivel, respUsuario[0].nivel, respUsuario[0].heroi);
        }
    }

    // ==============Popular Dados======================
    function populaDadosHeroi(xpAtual, xpProximoNivel, nivelAtual, heroi) {
        let nivelMeuHeroi = nivelAtual;
        if(nivelAtual>4) {
            nivelMeuHeroi = 4;
        }
        const xpNivelAnterior = calculaXpProximoNivel(nivelAtual-1);
        xpPercorrido = xpAtual - xpNivelAnterior;
        xpPercorrer = xpProximoNivel - xpNivelAnterior;
        document.getElementById('tituloMeuHeroi').innerHTML = `Meu Herói - <em><strong style="color: #fed22b;">${xpAtual}Xp/${xpProximoNivel}Xp</strong></em>`;
        document.getElementById('containerExperiencia').innerHTML = `
            <span id="nivelAtual"><p>${nivelAtual}</p></span>
            <div id="barraExperiencia">
                <div id="minhaExperiencia" style="width: ${parseFloat((xpPercorrido*100)/xpPercorrer)}% !important;"></div>
                <span id="totalExperiencia" style="left: calc(${parseFloat((xpPercorrido*100)/xpPercorrer)}% - 100px);"><p>${xpAtual}Xp</p></span>
            </div>
            <span id="proximoNivel"><p>${parseInt(nivelAtual+1)}</p></span>
        `;
        document.getElementById('heroi').innerHTML = `
            <img id="imagemMeuHeroi" src="herois/${heroi}/${heroi}-${nivelMeuHeroi}.png" alt="Herói">
        `;
    }

    // ===================Escolher Heroi========================
    async function escolherHeroi() {
        document.getElementById('escolherHeroi').style.display = 'flex';
        document.getElementById('escolherHeroi').innerHTML = `<img id="voltarHome" onclick="voltarHome()" src="imgs/voltar.png" alt="Voltar">`;
        for(let x = 0; x < heroisParaEscolha.length; x++) {
            document.getElementById('escolherHeroi').innerHTML += `
                <div class="heroi">
                    <div class="escolherHeroiImagem">
                        <img src="herois/${heroisParaEscolha[x]}/${heroisParaEscolha[x]}-1.png" alt="${heroisParaEscolha[x]}">
                    </div>
                    <button id="${heroisParaEscolha[x]}" class="escolherHeroi" onclick="heroiEscolhido(this.id)">Escolher</button>
                </div>
            `;
        }
    }
}
function voltarHome() {
    window.location.href = '/estudos.html';
}

async function heroiEscolhido(nome) {
    document.getElementById('escolherHeroi').innerHTML = '';
    document.getElementById('escolherHeroi').style.display = 'none';
    mudarHeroiUsuario(nome);
}

async function mudarHeroiUsuario(heroi) {
    carregamento();
    const ipUsuario = await pegarIp();
    const usuario = pegarCookies('apelido');
    try {
        if(heroi == heroisParaEscolha[0] || heroi == heroisParaEscolha[1]) {
            const resp = await fetch(`${host}/usuario/patch?ip=${ipUsuario}&nome=${usuario}`, {
                method: "PATCH",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "heroi": heroi
                })
            })
        }
        window.location.reload();
        pararCarregamento();
    } catch (error) {
        mostrarMensagem('Tivemos problemas de conexao com o servidor!');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
    pararCarregamento();
}