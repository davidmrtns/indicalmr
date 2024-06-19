import React, { useState, useEffect } from "react";
import Recursos from "../classes/Recursos";
import style from "./Cadastro.module.css";
import Fetch from "../classes/Fetch";
import Utils from "../classes/Utils";
import InputMask from "react-input-mask";
import { faCircleCheck, faCircleXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function RecuperarSenha() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const utils = new Utils();
    const LMRLogo = recursos.getLMRLogo();

    const [botaoLogin, setBotaoLogin] = useState(false);
    const [exibir, setExibir] = useState(false);
    const [enviado, setEnviado] = useState(null);
    const [mensagem, setMensagem] = useState(null);
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

    function validarCpf() {
        setValCpf(utils.validarCpf(cpf));
    }

    const atualizarCpf = (cpf) => {
        setCpf(cpf);
        ocultar();
    };

    function validarSenha() {
        setValSenha({
            minCaract: utils.validarSenha(senha, 0)
        });
    }

    function confirmarSenha() {
        confirmacao === senha ? setValSenha({ ...valSenha, confirmacao: true }) : setValSenha({ ...valSenha, confirmacao: false });
    }

    function ocultar() {
        setExibir(false);
        setSenha(null);
        setConfirmacao(null);
        setValSenha({ minCaract: false, confirmacao: null });
    }

    function voltar() {
        window.location.href = '/';
    }

    async function enviarSolicitacao() {
        setEnviado(true);
        setMensagem(false);

        var celular = document.getElementById("celular").value.replace(/[()\-_ ]/g, '');
        var cpfFormatado = cpf.replace(/[.\-_]/g, '');

        if (valCpf === true && valSenha.confirmacao === true && cpfFormatado !== '' && celular !== '' && celular.length === 11) {
            var response = await fetch.recuperarSenha(cpfFormatado, celular, senha);

            if (response === true) {
                setExibir(false);
                setBotaoLogin(true);
                setMensagem("Sua senha foi atualizada");
            } else {
                setMensagem("Não foi possível atualizar sua senha. Tente novamente");
            }
        } else {
            setMensagem("Preencha os campos acima corretamente");
        }

        setEnviado(false);
    }

    async function checarDados() {
        setEnviado(true);
        setMensagem(false);

        var celular = document.getElementById("celular").value.replace(/[()\-_ ]/g, '');
        var cpfFormatado = cpf.replace(/[.\-_]/g, '');

        if (celular === '' || celular.length < 11 || cpf === '') {
            setMensagem('Preencha os campos corretamente');
        } else {
            var response = await fetch.verificarDadosRecuperarSenha(cpfFormatado, celular);

            if (response.status === true) {
                setExibir(true);
            } else {
                setExibir(false);
                if (response.telefone !== null) {
                    setMensagem("O número de celular deve corresponder ao cadastrado em sua conta: " + response.telefone);
                } else {
                    setMensagem("Não encontramos seu cadastro em nossa base de dados. Tente se cadastrar primeiro");
                }
            }
        }
        setEnviado(false);
    }

    return (
        <div className={style.cadastro}>
            <div className={style.cadastrocard}>
                <LMRLogo className={style.logolmr} />
                <div className={style.formulario}>
                    <h1>Recuperação de senha</h1>
                    <div>
                        <div className={style.campo}>
                            <InputMask mask="999.999.999-99" placeholder="CPF" id="cpf" type="text" onChange={(e) => atualizarCpf(e.target.value)} />
                        </div>
                        <div className={style.campo}>
                            <InputMask mask="(99) 99999-9999" placeholder="Celular" id="celular" type="tel" onChange={() => ocultar()} />
                        </div>
                        {exibir === true ?
                            <>
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
                    </div>
                    {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                    <div className={style.botao}>
                        <div className={style.opcoescadastro}>
                            <button className={enviado ? style.enviado : ""} disabled={enviado} onClick={() => exibir === true ? enviarSolicitacao() : botaoLogin === true ? voltar() : checarDados()}>
                                {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                                    : exibir === true ? "Alterar" : botaoLogin === true ? "Entrar" : "Próximo"}
                            </button>
                            {botaoLogin === false ? <button className={style.btcancelar} onClick={() => voltar()}>Voltar</button> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecuperarSenha;