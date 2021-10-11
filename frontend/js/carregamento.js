var trocarImagem;
var imagens = ["/herois/mulher-maravilha/mulher-maravilha-1.png", "/herois/naruto/naruto-1.png", "/herois/mulher-maravilha/mulher-maravilha-2.png", "/herois/naruto/naruto-2.png", "/herois/mulher-maravilha/mulher-maravilha-3.png", "/herois/naruto/naruto-3.png", "/herois/mulher-maravilha/mulher-maravilha-4.png", "/herois/naruto/naruto-4.png"]

//  ==========Sortear===============
function sorteador(max) {
    return Math.floor(Math.random() * max + 1)
}


// ============Funcoes carregamento================
function carregamento() {
    document.getElementById('carregamento').style.display = 'flex';
    document.getElementById('carregamento').innerHTML = `
        <img id='imgCarregamento' src="herois/mulher-maravilha/mulher-maravilha-1.png">
        <p>Carregando...</p>
    `
    trocarImagem = setInterval(() => {
        document.getElementById('imgCarregamento').src = imagens[sorteador(imagens.length-1)]
    }, 5000)
}

function pararCarregamento() {
    document.getElementById('carregamento').style.display = 'none';
    clearInterval(trocarImagem)
}