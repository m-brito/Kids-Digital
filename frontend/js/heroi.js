window.onload = function() {
    verificarLogin();
    verificarExistenciaHeroi();

    // ==============Escutador imagem - voltar=================
    document.getElementById('voltar').addEventListener('click', () => {
        window.location.href = '/estudos.html';
    })

    // ====================Verificar Heroi e popular===============

    async function verificarExistenciaHeroi() {
        const ipUsuario = await pegarIp();
        const usuario = pegarCookies('apelido');
        const respUsuario = await procurarUsuario(ipUsuario, usuario);
        if(respUsuario[0].heroi == null) {
            escolherHeroi(ipUsuario, usuario);
        } else {
            const xpProximoNivel = calculaXpProximoNivel(respUsuario[0].nivel);
            populaDadosHeroi(respUsuario[0].experiencia, xpProximoNivel, respUsuario[0].nivel);
        }
    }

    // ==============Popular Dados======================
    function populaDadosHeroi(xpAtual, xpProximoNivel, nivelAtual) {
        document.getElementById('tituloMeuHeroi').innerHTML = `Meu Herói - <em><strong style="color: #fed22b;">${xpAtual}Xp/${xpProximoNivel}Xp</strong></em>`;
        document.getElementById('containerExperiencia').innerHTML = `
            <span id="nivelAtual"><p>${nivelAtual}</p></span>
            <div id="barraExperiencia">
                <div id="minhaExperiencia" style="width: ${parseFloat((xpAtual*100)/xpProximoNivel)}% !important;"></div>
                <span id="totalExperiencia" style="left: calc(${parseFloat((xpAtual*100)/xpProximoNivel)}% - 100px);"><p>${xpAtual}Xp</p></span>
            </div>
            <span id="proximoNivel"><p>${parseInt(nivelAtual+1)}</p></span>
        `;
    }

    // ===================Escolher Heroi========================
    async function escolherHeroi(ipUsuario, usuario) {
        
    }
}