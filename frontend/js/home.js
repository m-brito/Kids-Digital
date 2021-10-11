window.onload = function() {
    verificarUsuarioLogado();
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
                document.cookie = `apelido=${apelidoEntrar}`;
                document.cookie = `ipUsuario=${ipUsuario}`;
                window.location.href = '/estudos.html';
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
                cadastrarUsuario(ipUsuario, apelidoCadastrar);
                document.cookie = `apelido=${apelidoCadastrar}`;
                document.cookie = `ipUsuario=${ipUsuario}`;
                window.location.href = '/estudos.html';
            }
        } catch (error) {
            console.log(error);
            mostrarMensagem('Tivemos problemas com a conexao!');
        }
    })

    // ==============Verificar usuario ja logado==============

    async function verificarUsuarioLogado() {
        const usuario = pegarCookies('apelido');
        const ipUsuario = pegarCookies('ipUsuario');
        if(!(usuario == '' || ipUsuario == '' || usuario == undefined || ipUsuario == undefined || usuario == null || ipUsuario == null)) {
            document.getElementById('usuarioJaLogado').innerHTML = `
            <form id="formularioUsuarioLogado" action="#">
                <p>Voce ja esta logado como <em><strong style="color: #fed22b;">${usuario}</strong></em> - Deseja entrar ou sair?</p>
                <button id="entrarConta">Entrar</button>
                <button id="sairConta">Sair</button>
            </form>
            `;
            document.getElementById('usuarioJaLogado').style.display = 'flex';
            escutadorUsuarioLogado();
        }
    }

    function escutadorUsuarioLogado() {
        document.getElementById('formularioUsuarioLogado').addEventListener('submit', (event) => {
            event.preventDefault();
            if(event.submitter.id == 'entrarConta') {
                window.location.href = '/estudos.html';
            } else {
                document.cookie = `apelido=`;
                document.cookie = `ipUsuario=`;
                window.location.reload();
            }
        })
    }
}