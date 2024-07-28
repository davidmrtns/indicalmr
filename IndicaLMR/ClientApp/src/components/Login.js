import React, { Component, useState } from "react";
import Recursos from "../classes/Recursos";
import style from "./Login.module.css";
import Fetch from "../classes/Fetch";
import InputMask from "react-input-mask";
import { faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Login() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const LMRLogo = recursos.getLMRLogo();
    const [mensagem, setMensagem] = useState(null);
    const [enviado, setEnviado] = useState(null);
    const [cpf, setCpf] = useState('');
    const [exibirSenha, setExibirSenha] = useState(false);

    function enviar(e) {
        if (e.keyCode === 13) {
            enviarSolicitacao();
        }
    }

    async function enviarSolicitacao() {
        setEnviado(true);

        var cpfFormatado = cpf.replace(/[.\-_]/g, '');
        var senha = document.getElementById("senha").value;

        if (cpfFormatado.length === 11 && senha) {
            var resultado = await fetch.conectar(cpfFormatado, senha);

            if (resultado.status === 200) {
                window.location.href = "/";
            } else if (resultado.status === 401) {
                setMensagem('O usuário ou senha inseridos não existem');
                setEnviado(false);
            }
        } else {
            setMensagem('Digite um CPF e senha válidos!');
            setEnviado(false);
        }
    }

    return (
        <div className={style.login}>
            <div className={style.logincard}>
                <LMRLogo className={style.logolmr} />
                <div className={style.formulario}>
                    <h1>Login</h1>
                    <form autoComplete="on">
                        <div className={style.campo}>
                            <InputMask name="cpf" mask="999.999.999-99" placeholder="CPF" id="cpf" type="text" onChange={(e) => setCpf(e.target.value)} />
                        </div>
                        <div className={style.campo}>
                            <input name="senha" placeholder="Senha" id="senha" type={exibirSenha === false ? "password" : "text"} onKeyDown={(e) => enviar(e)} />
                            <p className={style.exibirsenha}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p>
                        </div>
                        <div>
                            <a className={style.link} href="/recuperar"><FontAwesomeIcon icon={faKey} /> Esqueci minha senha</a>
                        </div>
                        {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                        <div className={style.botao}>
                            <button className={enviado ? style.enviado : ""} id="btentrar" type="button" disabled={enviado} onClick={() => enviarSolicitacao()}>
                                {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                                    : "Entrar"}
                            </button>
                        </div>
                    </form>
                </div>
                <a className={style.link} href="/cadastro">Acessando pela primeira vez? Clique aqui</a>
            </div>
        </div>
    );
}

export default Login;