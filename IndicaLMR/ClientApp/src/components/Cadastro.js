import React, { Component, useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import Recursos from "../classes/Recursos";
import style from "./Cadastro.module.css";
import Fetch from "../classes/Fetch";
import Utils from "../classes/Utils";
import InputMask from "react-input-mask";
import { faCircleCheck, faCircleXmark,  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Login() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const utils = new Utils();
    const LMRLogo = recursos.getLMRLogo();

    const [enviado, setEnviado] = useState(null);
    const [possuiCadastro, setPossuiCadastro] = useState(false);
    const [mensagem, setMensagem] = useState(false);
    const [idUsuario, setIdUsuario] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [senha, setSenha] = useState(null);
    const [confirmacao, setConfirmacao] = useState(null);
    const [valCpf, setValCpf] = useState(false);
    const [valSenha, setValSenha] = useState({
        minCaract: false,
        caractEspec: false,
        minNum: false,
        minMinusc: false,
        minMaiusc: false,
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
            minCaract: utils.validarSenha(senha, 0),
            caractEspec: utils.validarSenha(senha, 1),
            minNum: utils.validarSenha(senha, 2),
            minMinusc: utils.validarSenha(senha, 3),
            minMaiusc: utils.validarSenha(senha, 4)
        });
    }

    function validarCpf() {
        setValCpf(utils.validarCpf(cpf));
    }

    function confirmarSenha() {
        confirmacao === senha ? setValSenha({ ...valSenha, confirmacao: true }) : setValSenha({ ...valSenha, confirmacao: false });
    }

    async function checarNovoParceiro() {
        setEnviado(true);
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
        setEnviado(false);
    }

    async function enviarSolicitacao() {
        setEnviado(true);

        if (valCpf === true && valSenha.confirmacao === true) {
            var resultado = await fetch.atualizarDadosParceiro(idUsuario, cpf.replace(/[.\-_]/g, ''), senha);

            if (resultado.status === 200) {
                window.location.href = "/";
            } else if (resultado.status === 400) {
                alert('Um erro ocorreu');
                setEnviado(false);
            }
        } else {
            alert('Digite um CPF e senha válidos!');
            setEnviado(false);
        }
    }

    return (
        <div className={style.cadastro}>
            <div className={style.cadastrocard}>
                <LMRLogo className={style.logolmr} />
                <div className={style.formulario}>
                    <h1>Cadastro</h1>
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
                                <input placeholder="Senha" id="senha" type="password" onChange={(e) => setSenha(e.target.value)} />
                                {senha ?
                                    <div className={style.requisitos}>
                                        <h5>Sua senha deve conter:</h5>
                                        <p className={valSenha.minCaract === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minCaract === true ? faCircleCheck : faCircleXmark} /> No mínimo 8 caracteres</p>
                                        <p className={valSenha.caractEspec === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.caractEspec === true ? faCircleCheck : faCircleXmark} /> No mínimo 1 caractere especial</p>
                                        <p className={valSenha.minNum === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minNum === true ? faCircleCheck : faCircleXmark} /> No mínimo 1 número</p>
                                        <p className={valSenha.minMinusc === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minMinusc === true ? faCircleCheck : faCircleXmark} /> No mínimo 1 letra minúscula</p>
                                        <p className={valSenha.minMaiusc === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minMaiusc === true ? faCircleCheck : faCircleXmark} /> No mínimo 1 letra maiúscula</p>
                                    </div>
                                : ""}
                            </div>
                            <div className={style.campo}>
                                <input placeholder="Confirmação da senha" id="confirmacaoSenha" type="password" onChange={(e) => setConfirmacao(e.target.value)} />
                                {senha && valSenha.confirmacao !== null ?
                                    <div className={style.requisitos}>
                                        {valSenha.confirmacao === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> As senhas são iguais</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> As senhas devem ser iguais</p>}
                                    </div>
                                : ""}
                            </div>
                        </>
                        : ""}
                    {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                    <div className={style.botao}>
                        {idUsuario ?
                            <button className={enviado ? style.enviado : ""} id="btentrar" type="button" disabled={enviado} onClick={() => enviarSolicitacao()}>
                                {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                                    : "Entrar"}
                            </button>
                            : possuiCadastro ?
                                <button className={enviado ? style.enviado : ""} onClick={() => window.location.href = "/"}>
                                {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                                : "Entrar"}</button> :
                             <button className={enviado ? style.enviado : ""} onClick={() => checarNovoParceiro()}>
                             {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                             : "Próximo"}</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;