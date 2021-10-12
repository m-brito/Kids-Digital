window.onload = function() {
    verificarLogin();
    var idConteudo = parametroUrl('c');

    // ==============Escutador imagem - voltar=================
    document.getElementById('voltar').addEventListener('click', () => {
        window.location.href = '/estudos.html';
    });
}