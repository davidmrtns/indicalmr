import React, { Component, useState } from "react";
import Recursos from "../classes/Recursos";
import style from "./Login.module.css";
import Fetch from "../classes/Fetch";
import InputMask from "react-input-mask";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function LoginEscritorio() {
    var recursos = new Recursos();
    var fetch = new Fetch();
    const [enviado, setEnviado] = useState(null);
    const [exibirSenha, setExibirSenha] = useState(false);

    function enviar(e) {
        if (e.keyCode === 13) {
            enviarSolicitacao();
        }
    }

    async function enviarSolicitacao() {
        setEnviado(true);

        var email = document.getElementById("email").value;
        var senha = document.getElementById("senha").value;

        if (email && senha) {
            var resultado = await fetch.conectarEscritorio(email, senha);

            if (resultado.status === 200) {
                window.location.href = "/escritorio";
            } else if (resultado.status === 401) {
                alert('O e-mail ou senha inseridos não existem');
                setEnviado(false);
            }
        } else {
            alert('Digite um e-mail e senha válidos!');
            setEnviado(false);
        }
    }

    return (
        <div className={style.login}>
            <div className={style.logincard}>
                <h1>Login</h1>
                <div className={style.formulario}>
                    <div className={style.campo}>
                        <input type="text" placeholder="E-mail" id="email" />
                    </div>
                    <div className={style.campo}>
                        <input placeholder="Senha" id="senha" type={exibirSenha === false ? "password" : "text"} onKeyDown={(e) => enviar(e)} />
                        <p className={style.exibirsenha}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p>
                    </div>
                    <div className={style.botao}>
                        <button className={enviado ? style.enviado : ""} id="btentrar" type="button" disabled={enviado} onClick={() => enviarSolicitacao()}>
                            {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                                : "Entrar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginEscritorio;