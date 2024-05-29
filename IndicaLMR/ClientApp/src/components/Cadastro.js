import React, { useState, useEffect } from "react";
import Recursos from "../classes/Recursos";
import style from "./Cadastro.module.css";
import Fetch from "../classes/Fetch";
import Utils from "../classes/Utils";
import InputMask from "react-input-mask";
import { faCircleCheck, faCircleXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Login() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const utils = new Utils();
    const LMRLogo = recursos.getLMRLogo();

    const [statusCadastro, setStatusCadastro] = useState({
        exibir: false,
        cadastroCliente: false,
        cadastroIndicado: false
    });
    const [exibirCadastroCliente, setExibirCadastroCliente] = useState(false);
    const [enviado, setEnviado] = useState(null);
    const [possuiCadastro, setPossuiCadastro] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [idUsuario, setIdUsuario] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [senha, setSenha] = useState(null);
    const [confirmacao, setConfirmacao] = useState(null);
    const [exibirSenha, setExibirSenha] = useState(false);
    const [valCpf, setValCpf] = useState(false);
    const [valSenha, setValSenha] = useState({
        minCaract: false,
        confirmacao: null
    });

    useEffect(() => {
        if (senha) {
            validarSenha();
            if (confirmacao) {
                confirmarSenha();
            }
        }
    }, [senha]);

    useEffect(() => {
        if (confirmacao) {
            confirmarSenha();
        }
    }, [confirmacao]);

    useEffect(() => {
        if (cpf) {
            validarCpf();
        }
    }, [cpf]);

    function ocultar() {
        setIdUsuario(null);
        setMensagem(null);
        setPossuiCadastro(false);
    }

    function validarSenha() {
        setValSenha({
            minCaract: utils.validarSenha(senha, 0)
        });
    }

    function voltar() {
        setStatusCadastro({
            exibir: false,
            cadastroCliente: false,
            cadastroIndicado: false
        });
        setMensagem(null);
    }

    function validarCpf() {
        setValCpf(utils.validarCpf(cpf));
    }

    function confirmarSenha() {
        confirmacao === senha ? setValSenha({ ...valSenha, confirmacao: true }) : setValSenha({ ...valSenha, confirmacao: false });
    }

    async function checarNovoParceiro() {
        setEnviado(true);

        if (statusCadastro.cadastroIndicado) {
            var celular = document.getElementById("celular").value.replace(/[()\-_ ]/g, '');

            if (celular === '' || celular.length < 11) {
                setMensagem('Digite um celular válido');
            } else {
                var response = await fetch.verificarNovoParceiro(celular);

                if (response != null) {
                    var status = response.clone().status;

                    if (status === 200) {
                        var resposta = await response.clone().json();

                        if (resposta.novoParceiro === true) {
                            setIdUsuario(resposta.id)
                        } else {
                            setMensagem("Você já possui cadastro. Clique no botão abaixo para entrar com seu CPF e senha");
                            setPossuiCadastro(true);
                        }
                    } else {
                        setMensagem("Opa, parece que você não foi indicado por ninguém ainda");
                    }
                }
            }
        } else {
            if (cpf !== null) {
                var cpfFormatado = cpf.replace(/[.\-_]/g, '');

                if (cpfFormatado === '' || cpfFormatado.length < 11) {
                    setMensagem("Digite um CPF válido");
                } else {
                    var response = await fetch.verificarNovoParceiroCliente(cpfFormatado);

                    if (response != null) {
                        var status = response.clone().status;

                        if (status === 200) {
                            var resposta = await response.clone().json();

                            if (resposta === true) {
                                var id = await fetch.verificarParceiroIndica(cpfFormatado);

                                if (id !== 0) {
                                    setMensagem("Você já possui cadastro. Clique no botão abaixo para entrar com seu CPF e senha");
                                    setPossuiCadastro(true);
                                } else {
                                    setExibirCadastroCliente(true);
                                }
                            } else {
                                setMensagem("Não encontramos seu CPF em nossa base de dados. Entre em contato com o escritório")
                            }
                        } else {
                            setMensagem("Opa, um erro ocorreu. Tente novamente");
                        }
                    }
                }
            } else {
                setMensagem("Digite um CPF válido");
            }
        }
        setEnviado(false);
    }

    async function enviarSolicitacao() {
        setEnviado(true);

        if (valCpf === true && valSenha.confirmacao === true) {
            var resultado;

            if (statusCadastro.cadastroIndicado) {
                resultado = await fetch.atualizarDadosParceiro(idUsuario, cpf.replace(/[.\-_]/g, ''), senha);
            } else {
                resultado = await fetch.cadastrarParceiro(document.getElementById('nome').value, document.getElementById('celular').value.replace(/[()\-_ ]/g, ''), cpf.replace(/[.\-_]/g, ''), senha);
            }

            var codigo = resultado.clone().status;
            var resposta = await resultado.json().then((data) => { return data });

            if (codigo === 200 && resposta === true) {
                window.location.href = "/";
            } else if (codigo === 400) {
                setMensagem('Um erro ocorreu. Tente novamente');
            } else {
                setMensagem('Esse CPF já está sendo usado');
            }
            setEnviado(false);
        } else {
            setMensagem('Preencha os campos corretamente!');
            setEnviado(false);
        }
    }

    return (
        <div className={style.cadastro}>
            <div className={style.cadastrocard}>
                <LMRLogo className={style.logolmr} />
                <div className={style.formulario}>
                    <h1>Cadastro</h1>
                    {statusCadastro.exibir ?
                        <>
                            {statusCadastro.cadastroIndicado ?
                                <>
                                    <div className={style.campo}>
                                        <InputMask mask="(99) 99999-9999" placeholder="Celular" id="celular" type="tel" onChange={() => ocultar()} />
                                    </div>
                                    {idUsuario ?
                                        <>
                                            <div className={style.campo}>
                                                <InputMask mask="999.999.999-99" placeholder="CPF" id="cpf" type="text" onChange={(e) => setCpf(e.target.value)} />
                                                {cpf ?
                                                    <div className={style.requisitos}>
                                                        {valCpf === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> CPF válido</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> CPF inválido</p>}
                                                    </div>
                                                : ""}
                                            </div>
                                            <div className={style.campo}>
                                                <div className={style.campoexibirsenha}>
                                                    <input placeholder="Senha" id="senha" type={exibirSenha === false ? "password" : "text"} onChange={(e) => setSenha(e.target.value)} />
                                                    <p className={style.exibirsenha}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p>
                                                </div>
                                                {senha ?
                                                    <div className={style.requisitos}>
                                                        <h5>Sua senha deve conter:</h5>
                                                        <p className={valSenha.minCaract === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minCaract === true ? faCircleCheck : faCircleXmark} /> No mínimo 6 caracteres</p>
                                                    </div>
                                                 : ""}
                                            </div>
                                            <div className={style.campo}>
                                                <div className={style.campoexibirsenha}>
                                                    <input placeholder="Confirmação da senha" id="confirmacaoSenha" type={exibirSenha === false ? "password" : "text"} onChange={(e) => setConfirmacao(e.target.value)} />
                                                    <p className={style.exibirsenha}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p>
                                                </div>
                                                {senha && valSenha.confirmacao !== null ?
                                                    <div className={style.requisitos}>
                                                        {valSenha.confirmacao === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> As senhas são iguais</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> As senhas devem ser iguais</p>}
                                                    </div>
                                                : ""}
                                            </div>
                                        </>
                                    : ""}
                                </>
                            :
                                <>
                                    <div className={style.campo}>
                                        <InputMask mask="999.999.999-99" placeholder="CPF" id="cpf" type="text" onChange={(e) => setCpf(e.target.value)} />
                                    </div>
                                    {exibirCadastroCliente ?
                                        <>
                                            <div className={style.campo}>
                                                <input placeholder="Nome" id="nome" type="text" />
                                            </div>
                                            <div className={style.campo}>
                                                <InputMask mask="(99) 99999-9999" placeholder="Celular" id="celular" type="tel" />
                                            </div>
                                            <div className={style.campo}>
                                                <div className={style.campoexibirsenha}>
                                                    <input placeholder="Senha" id="senha" type={exibirSenha === false ? "password" : "text"} onChange={(e) => setSenha(e.target.value)} />
                                                    <p className={style.exibirsenha}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p>
                                                </div>
                                                {senha ?
                                                    <div className={style.requisitos}>
                                                        <h5>Sua senha deve conter:</h5>
                                                        <p className={valSenha.minCaract === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minCaract === true ? faCircleCheck : faCircleXmark} /> No mínimo 6 caracteres</p>
                                                    </div>
                                                : ""}
                                            </div>
                                            <div className={style.campo}>
                                                <div className={style.campoexibirsenha}>
                                                    <input placeholder="Confirmação da senha" id="confirmacaoSenha" type={exibirSenha === false ? "password" : "text"} onChange={(e) => setConfirmacao(e.target.value)} />
                                                    <p className={style.exibirsenha}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p>
                                                </div>
                                                {senha && valSenha.confirmacao !== null ?
                                                    <div className={style.requisitos}>
                                                        {valSenha.confirmacao === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> As senhas são iguais</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> As senhas devem ser iguais</p>}
                                                    </div>
                                                : ""}
                                            </div>
                                        </>
                                    : ""}
                                </>
                            }
                            {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                            <div className={style.botao}>
                                {idUsuario || exibirCadastroCliente ?
                                    <button className={enviado ? style.enviado : ""} id="btentrar" type="button" disabled={enviado} onClick={() => enviarSolicitacao()}>
                                        {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                                            : "Cadastrar"}
                                    </button>
                                    : possuiCadastro ?
                                        <button className={enviado ? style.enviado : ""} onClick={() => window.location.href = "/"}>
                                            {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                                                : "Entrar"}</button> :
                                        <div className={style.opcoescadastro}>
                                            <button onClick={() => voltar()}>Voltar</button>
                                            <button className={enviado ? style.enviado : ""} onClick={() => checarNovoParceiro()}>
                                                {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                                                    : "Próximo"}</button>
                                        </div>
                                    }
                            </div>
                        </>
                    :
                        <div className={style.opcoescadastro}>
                            <button onClick={() => setStatusCadastro({exibir: true, cadastroCliente: true, cadastroIndicado:false})}>Sou cliente da LMR</button>
                            <button onClick={() => setStatusCadastro({ exibir: true, cadastroIndicado: true, cadastroCliente:false })}>Fui indicado</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Login;