window.onload = function() {
    // =========Entrar====================
    document.querySelector('#homeEntrar').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const ipUsuario = await pegarIp();
            const apelidoEntrar = document.getElementById('campoApelidoEntrar').value;
            carregamento();
            const resp = await procurarUsuario(ipUsuario, apelidoEntrar);
            document.getElementById('campoApelidoEntrar').value = '';
            pararCarregamento();
            if(resp.length > 0) {
                console.log('encontrou');
            } else {
                mostrarMensagem('Usuario não encontrado!');
            }
        } catch (error) {
            console.log(error);
            mostrarMensagem('Tivemos problemas com a conexao!');
        }
    })

    // ============Cadastrar==============
    document.querySelector('#homeCadastrar').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const ipUsuario = await pegarIp();
            const apelidoCadastrar = document.getElementById('campoApelidoCadastrar').value;
            carregamento();
            const resp = await procurarUsuarioNome(apelidoCadastrar);
            pararCarregamento();
            if(resp.length > 0) {
                mostrarMensagem('Este apelido ja esta em uso!');
            } else {
                cadastrarUsuario(ipUsuario, apelidoCadastrar)
            }
        } catch (error) {
            console.log(error);
            mostrarMensagem('Tivemos problemas com a conexao!');
        }
    })
}