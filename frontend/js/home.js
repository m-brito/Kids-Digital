window.onload = function() {
    // =========Entrar====================
    document.querySelector('#homeEntrar').addEventListener('submit', (event) => {
        event.preventDefault();
        carregamento();
    })

    // ============Cadastrar==============
    document.querySelector('#homeCadastrar').addEventListener('submit', (event) => {
        event.preventDefault();
    })
}