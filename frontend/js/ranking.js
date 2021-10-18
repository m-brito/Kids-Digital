window.onload = function() {
    verificarLogin();
    popularRanking();

    // ==============Escutador imagem - voltar=================
    document.getElementById('voltar').addEventListener('click', () => {
        window.location.href = '/estudos.html';
    })
    // ==============Escutador imagem - fechar modal de efeitos=================
    document.getElementById('fecharModalEfeitos').addEventListener('click', () => {
        document.getElementById('containerEfeitos').innerHTML = "";
        document.getElementById('modalEfeitos').style.display = 'none';
    })

    // ================Popular Ranking=================
    async function popularRanking() {
        const ipUsuario = pegarCookies('ipUsuario');
        const apelido = pegarCookies('apelido');
        const idUsuarioLogado = await buscarIdUsuario();
        carregamento();
        const respUsuario = await procurarUsuario(ipUsuario, apelido);
        document.getElementById('h1RankingTitulo').innerHTML = `
            Ranking - <strong style="color: #fed22b;">Voce - ${respUsuario[0].experiencia}Xp</strong>
        `;
        try {
            const ranking = await buscarRanking();
            document.getElementById('posicoesRanking').innerHTML = '';
            for(let x = 0; x < ranking.length; x++) {
                if(x < 40) {
                    if(idUsuarioLogado == ranking[x].id) {
                        document.getElementById('posicoesRanking').innerHTML += `
                            <div style="color: #fed22b;" id="${ranking[x].id}" onclick="listarEfeitos(this.id)" class="usuarioPlacar">
                                <div class="numeroPosicao"><p style="color: #fed22b;"><strong>#${x+1}</strong></p></div>
                                <div class="nomeUsuario"><p style="color: #fed22b;"><strong>${ranking[x].nome} - ${ranking[x].experiencia}Xp</strong></p></div>
                            </div>
                        `;
                    } else {
                        document.getElementById('posicoesRanking').innerHTML += `
                            <div id="${ranking[x].id}" onclick="listarEfeitos(this.id)" class="usuarioPlacar">
                                <div class="numeroPosicao"><p>#${x+1}</p></div>
                                <div class="nomeUsuario"><p>${ranking[x].nome} - ${ranking[x].experiencia}Xp</p></div>
                            </div>
                        `;
                    }
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

var descricaoEfeitos = {
    Congelamento: 'O usuario que for atingido não recebe xp ate o dia seguinte!',
    "Limpar efeitos": 'O usuario que for atingido sera liberto de outros efeitos'
}

var efeitos = {
    1: "Congelamento",
    2: "Limpar efeitos"
}

async function listarEfeitos(idUsuario) {
    var meusEfeitos = {
        1: {
            qtde: 0,
            mostrou: false,
        },
        2: {
            qtde: 0,
            mostrou: false,
        }
    }
    document.getElementById('modalEfeitos').style.display = 'flex';
    let idUsuarioLogado = await buscarIdUsuario();
    const efeitosUsuarioLogado = await buscarEfeitosUsuario(idUsuarioLogado);
    document.getElementById('containerEfeitos').innerHTML = ""
    for(let x=0; x<efeitosUsuarioLogado.length; x++) {
        meusEfeitos[efeitosUsuarioLogado[x].idEfeito].qtde += 1
    }
    if(efeitosUsuarioLogado.length == 0) {
        document.getElementById('containerEfeitos').innerHTML += `<p style='color: white'>Voce não tem efeitos!</p>`;
    } else if(idUsuario == idUsuarioLogado && meusEfeitos[2].qtde == 0) {
        document.getElementById('containerEfeitos').innerHTML += `<p style='color: white'>Voce não tem efeitos para ser usado em voce mesmo!</p>`;
    }
    for(let x=0; x<efeitosUsuarioLogado.length; x++) {
        if((meusEfeitos[efeitosUsuarioLogado[x].idEfeito].mostrou == false && idUsuario != idUsuarioLogado) || (meusEfeitos[efeitosUsuarioLogado[x].idEfeito].mostrou == false && idUsuario == idUsuarioLogado && efeitosUsuarioLogado[x].idEfeito == 2)) {
            document.getElementById('containerEfeitos').innerHTML += `
                <div class="flip-container">
                    <div class="flipper">
                        <div class="front">
                            <p class="qtdeEfeito">${meusEfeitos[efeitosUsuarioLogado[x].idEfeito].qtde}</p>
                            <img src="/efeitos/${efeitos[efeitosUsuarioLogado[x].idEfeito]}.png" />
                        </div>
                        <div class="back">
                            <h3><strong>${efeitos[efeitosUsuarioLogado[x].idEfeito]}</strong></h3>
                            <p>${descricaoEfeitos[efeitos[efeitosUsuarioLogado[x].idEfeito]]}</p>
                            <button onclick="aplicarEfeito(${idUsuario}, ${efeitosUsuarioLogado[x].idEfeito}, ${idUsuarioLogado}, ${efeitosUsuarioLogado[x].id})">Usar</button>
                        </div>
                    </div>
                </div>
            `;
            meusEfeitos[efeitosUsuarioLogado[x].idEfeito].mostrou = true;
        }
    }
}

async function aplicarEfeito(idUsuarioAtacado, idEfeito, idUsuarioLogado, idEfeitoLancado) {
    let usuarioAtacado = await procurarUsuarioId(idUsuarioAtacado);
    if(idEfeito == 2) {
        let idEfeitoAtingido = await buscarEfeitosAtingidos(idUsuarioAtacado, pegarData());
        if(idEfeitoAtingido.length <= 0) {
            mostrarMensagem("Nenhum efeito para ser liberado!")
        } else {
            deleteEfeito(idEfeitoAtingido[0].id);
            deleteEfeitoDeUsuario(idEfeitoLancado)
            mostrarMensagem(`Usuario "${usuarioAtacado[0].nome}" foi liberado de outros efeitos!`)
            setTimeout(() => {
                window.location.reload();
            }, 2500);
        }
    } else {
        if(idUsuarioAtacado == idUsuarioLogado) {
            mostrarMensagem("Voce não pode usar este efeito em voce mesmo!")
        } else {
            let idEfeitoAtingido = await buscarEfeitosAtingidos(idUsuarioAtacado, pegarData());
            if(idEfeitoAtingido.length > 0) {
                mostrarMensagem("Este usuario ja foi atacado hoje!")
            } else {
                cadastrarAtinge(pegarData(), idUsuarioAtacado, idEfeito, idUsuarioLogado);
                deleteEfeitoDeUsuario(idEfeitoLancado);
                mostrarMensagem(`O usuario foi atacado!`)
                setTimeout(() => {
                    window.location.reload();
                }, 2500);
            }
        }
    }
}