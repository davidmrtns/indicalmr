import React, { Component, useState, useEffect } from "react";
import Fetch from "../classes/Fetch";
import InputMask from "react-input-mask";
import { faCircleCheck, faCircleXmark, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './NewPartnerPage.module.css';
import Utils from "../classes/Utils";
import Recursos from "../classes/Recursos";

function NewPartnerPage() {
    const fetch = new Fetch();
    const utils = new Utils();
    const recursos = new Recursos();
    const [enviado, setEnviado] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [senha, setSenha] = useState(null);
    const [confirmacao, setConfirmacao] = useState(null);
    const [valCpf, setValCpf] = useState(false);
    const [valSenha, setValSenha] = useState({
        minCaract: false
    });

    function validarSenha() {
        setValSenha({
            minCaract: utils.validarSenha(senha, 0)
        });
    }

    function validarCpf() {
        setValCpf(utils.validarCpf(cpf));
    }

    function confirmarSenha() {
        confirmacao === senha ? setValSenha({ ...valSenha, confirmacao: true }) : setValSenha({ ...valSenha, confirmacao: false });
    }

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

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    async function enviarSolicitacao() {
        setEnviado(true);
        var nome = document.getElementById('nome').value;
        var celular = document.getElementById('celular').value.replace(/[()\-_ ]/g, '');
        var tipo = document.getElementById('tipo').value;

        if (nome && celular && valCpf === true && valSenha.confirmacao === true) {
            var resultado = await fetch.criarParceiro(nome, celular, cpf.replace(/[.\-_]/g, ''), tipo, senha);

            if (resultado === true) {
                alert('Parceiro criado');
                setEnviado(false);
            } else {
                alert('Não foi possível cadastrar. Verifique se não há um parceiro já cadastrado com o CPF e/ou celular informados');
                setEnviado(false);
            }
        } else {
            alert('Preencha os campos corretamente');
            setEnviado(false);
        }
    }

    return (
        <div className={style.container}>
            <h1>Cadastrar parceiro</h1>
            <div className={style.cardcadastro}>
                <div className={style.campo}>
                    <input type="text" id="nome" placeholder="Nome" />
                </div>
                <div className={style.campo}>
                    <InputMask mask="(99) 99999-9999" placeholder="Celular" id="celular" type="tel" />
                </div>
                <div className={style.campo}>
                    <InputMask mask="999.999.999-99" placeholder="CPF" id="cpf" type="text" onChange={(e) => setCpf(e.target.value)} />
                    {cpf ?
                        <div className={style.requisitos}>
                            {valCpf === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> CPF válido</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> CPF inválido</p>}
                        </div>
                        : ""}
                </div>
                <div className={style.campo}>
                    <select id="tipo">
                        <option value="1">Parceiro</option>
                        <option value="0">Indicador</option>
                    </select>
                </div>
                <div className={style.campo}>
                    <input placeholder="Senha" id="senha" type="password" onChange={(e) => setSenha(e.target.value)} />
                    {senha ?
                        <div className={style.requisitos}>
                            <h5>Sua senha deve conter:</h5>
                            <p className={valSenha.minCaract === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minCaract === true ? faCircleCheck : faCircleXmark} /> No mínimo 6 caracteres</p>
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
                <div className={style.campo}>
                    <button className={enviado ? style.enviado : ""} id="btentrar" type="button" disabled={enviado} onClick={() => enviarSolicitacao()}>
                        {enviado ? <img className={style.enviando} src={recursos.getEnviando()} />
                            : "Cadastrar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewPartnerPage;
