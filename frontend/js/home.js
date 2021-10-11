window.onload = function() {
    // =========Entrar====================
    document.querySelector('#homeEntrar').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const ipUsuario = await pegarIp();
            const apelidoEntrar = document.getElementById('campoApelidoEntrar').value
            carregamento();
            const resp = await procurarUsuario(ipUsuario, apelidoEntrar);
            document.getElementById('campoApelidoEntrar').value = '';
            pararCarregamento();
            if(resp.length>0) {
                console.log('encontrou')
            } else {
                mostrarMensagem('Usuario não encontrado!')
            }
        } catch (error) {
            console.log(error)
            mostrarMensagem('Tivemos problemas com a conexao!')
        }
    })

    // ============Cadastrar==============
    document.querySelector('#homeCadastrar').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const ipUsuario = await pegarIp();
        } catch (error) {
            console.log(error)
            mostrarMensagem('Tivemos problemas com a conexao!')
        }
    })
}