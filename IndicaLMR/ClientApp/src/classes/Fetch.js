class Fetch {
    async conectar(cpf, senha) {
        var response;

        try {
            response = await fetch('auth/autenticar', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cpf: cpf,
                    senha: senha
                })
            });
        } catch {
            response = null;
        }

        return response;
    }

    async checarLogin() {
        var resposta;
        await fetch('auth/validar', {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => response.json()).then((data) => { resposta = data });

        return resposta;
    }

    async buscarUsuario() {
        var resposta;

        try {
            await fetch('auth/usuario', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async atualizarUsuario() {
        var resposta;

        try {
            await fetch('auth/atualizar', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async verificarNovoParceiro(celular) {
        var response;

        try {
            response = await fetch('auth/novo-parceiro/' + celular, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch {
            response = null;
        }
        return response;
    }

    async verificarNovoParceiroCliente(cpf) {
        var response;

        try {
            response = await fetch('auth/novo-parceiro/cliente/' + cpf, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch {
            response = null;
        }
        return response;
    }

    async verificarParceiroIndica(cpf) {
        var resposta;

        try {
            await fetch('auth/parceiro-existente/' + cpf, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async atualizarDadosParceiro(id, cpf, senha) {
        var response;

        try {
            response = await fetch('auth/atualizar-dados', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    cpf: cpf,
                    senha: senha
                })
            });
        } catch {
            response = null;
        }

        return response;
    }

    async atualizarCredito() {
        var resposta;

        try {
            await fetch('auth/atualizar', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null
        }
        return resposta;
    }

    async desconectar() {
        fetch('auth/desconectar', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => { window.location.href = "/" });
    }

    async desconectarEscritorio() {
        fetch('auth/desconectar', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => { window.location.href = "/escritorio" });
    }

    async cadastrarParceiro(nome, celular, cpf, senha) {
        var response;

        try {
            response = await fetch('auth/novo-parceiro', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: celular,
                    cpf: cpf,
                    senha: senha
                })
            });
        } catch (e) {
            alert(e);
            response = null;
        }
        return response;
    }

    async criarParceiro(nome, celular, cpf, tipo, senha) {
        var resposta;

        try {
            await fetch('api/inserir-parceiro', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: celular,
                    cpf: cpf,
                    tipo: tipo,
                    senha: senha
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarTransacao(parceiro, valor, tipo, premio) {
        var resposta;

        try {
            await fetch('api/criar-transacao', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: 0,
                    parceiro: parceiro,
                    valor: valor,
                    tipo: tipo,
                    premio: premio,
                    baixa: false
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarIndicacao(parceiro, nome, celular) {
        var response;

        try {
            response = await fetch('api/criar-indicacao', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parceiro: parceiro,
                    nome: nome,
                    telefone: celular
                })
            });
        } catch {
            response = null;
        }
        return response;
    }

    async buscarParceiro() {
        var resposta;

        try {
            await fetch('api/buscar-dados-parceiro', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async buscarParceiroId(id) {
        var resposta;

        try {
            await fetch('api/buscar-dados-parceiro/' + id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async contarIndicacoes() {
        var resposta;

        try {
            await fetch('api/contar-indicacoes', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async contarIndicacoesFechadas() {
        var resposta;

        try {
            await fetch('api/contar-indicacoes-fechadas', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async contarIndicacoesId(id) {
        var resposta;

        try {
            await fetch('api/contar-indicacoes-id/' + id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async contarIndicacoesFechadasId(id) {
        var resposta;

        try {
            await fetch('api/contar-indicacoes-fechadas-id/' + id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarIndicacoes(pagina) {
        var resposta;

        try {
            await fetch('api/listar-indicacoes/?pagina=' + pagina + "&tamanhoPagina=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarIndicacoesPorId(id, pagina) {
        var resposta;

        try {
            await fetch('api/listar-indicacoes-id/' + id + '?pagina=' + pagina + "&tamanhoPagina=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarTransacoes(pagina) {
        var resposta;

        try {
            await fetch('api/listar-transacoes/?pagina=' + pagina + "&tamanhoPagina=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarTransacoesPorParceiro(id, pagina) {
        var resposta;

        try {
            await fetch('api/listar-transacoes-por-parceiro/' + id + '/?pagina=' + pagina + "&tamanhoPagina=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarTransacoesFiltro(pagina, tamanhoPagina, tipo, baixa, nome, cpf) {
        var resposta;

        try {
            await fetch('api/listar-transacoes-filtro/?pagina=' + pagina + "&tamanhoPagina=" + tamanhoPagina + '&tipo=' + tipo + '&baixa=' + baixa + '&nome=' + nome + '&cpf=' + cpf, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarParceiros(nome, cpf, tipo, pagina, tamPagina) {
        var resposta;

        try {
            await fetch('api/listar-parceiros/?nome=' + nome + '&cpf=' + cpf + '&tipo=' + tipo + '&pagina=' + pagina + '&tamanhoPagina=' + tamPagina, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async mudarStatusTransacao(id) {
        var resposta;

        try {
            await fetch('api/mudar-status-transacao/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async mudarStatusRepasse(id) {
        var resposta;

        try {
            await fetch('api/mudar-status-repasse/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async mudarStatusParceiro(id) {
        var resposta;

        try {
            await fetch('api/mudar-status/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarCobrancas(pagina) {
        var resposta;

        try {
            await fetch('api/asaas?pagina=' + pagina, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async editarDados(nome, telefone, senha) {
        var resposta;

        try {
            await fetch('api/editar-dados', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: telefone,
                    senha: senha
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async atualizarSenhaParceiro(id, senha, confirmacao) {
        var resposta;

        try {
            await fetch('api/editar-senha-parceiro', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    senha: senha,
                    confirmacao: confirmacao
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async excluirConta() {
        var resposta;

        try {
            await fetch('api/excluir-conta', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null
        }
        return resposta;
    }

    async listarConfiguracoes() {
        var resposta;

        try {
            await fetch('api/listar-configuracoes', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async atualizarConfiguracao(chave, valor) {
        var resposta;

        try {
            await fetch('api/atualizar-configuracao/' + chave + "?valor=" + valor, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async obterRealPonto() {
        var resposta;

        try {
            await fetch('api/real-em-ponto/', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarPremio(nome, valor, descricao, disponivel) {
        var resposta;

        try {
            await fetch('api/criar-premio', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: 0,
                    nome: nome,
                    valor: valor,
                    descricao: descricao,
                    disponivel: disponivel
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async editarPremio(id, nome, valor, descricao, disponivel, premioAntigo) {
        var resposta;

        try {
            await fetch('api/editar-premio', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    nome: nome,
                    valor: valor,
                    descricao: descricao,
                    disponivel: disponivel,
                    premioAntigo: premioAntigo
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarUsuario(nome, email, senha, admin) {
        var resposta;

        try {
            await fetch('api/criar-usuario', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: 0,
                    nome: nome,
                    email: email,
                    senha: senha,
                    administrador: admin
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarPremios() {
        var resposta;

        try {
            await fetch('api/listar-premios', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarPremiosDisponiveis() {
        var resposta;

        try {
            await fetch('api/listar-premios-disponiveis', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async editarUsuario(id, nome, email, senha, admin, usuarioAntigo) {
        var resposta;

        try {
            await fetch('api/editar-usuario', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    nome: nome,
                    email: email,
                    senha: senha,
                    administrador: admin,
                    usuarioAntigo: usuarioAntigo
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async excluirPremio(id) {
        var resposta;

        try {
            await fetch('api/excluir-premio/' + id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarUsuarios() {
        var resposta;

        try {
            await fetch('api/listar-usuarios', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async excluirUsuario(id) {
        var resposta;

        try {
            await fetch('api/excluir-usuario/' + id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async conectarEscritorio(email, senha) {
        var response;

        try {
            response = await fetch('auth/escritorio/autenticar', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            });
        } catch {
            response = null;
        }

        return response;
    }

    async checarLoginEscritorio() {
        var resposta;
        await fetch('auth/escritorio/validar', {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => response.json()).then((data) => { resposta = data });

        return resposta;
    }
}

export default Fetch;