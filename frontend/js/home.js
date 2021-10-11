window.onload = function() {
    // =========Entrar====================
    document.querySelector('#homeEntrar').addEventListener('submit', async (event) => {
        event.preventDefault();
        const ipUsuario = await pegarIp();
        const apelidoEntrar = document.getElementById('campoApelidoEntrar').value
        carregamento();
        const resp = await procurarUsuario(ipUsuario, apelidoEntrar);
        pararCarregamento();
        if(resp.length>0) {
            console.log('encontrou')
        } else {
            console.log('nao encontrou')
        }
    })

    // ============Cadastrar==============
    document.querySelector('#homeCadastrar').addEventListener('submit', (event) => {
        event.preventDefault();
    })
}