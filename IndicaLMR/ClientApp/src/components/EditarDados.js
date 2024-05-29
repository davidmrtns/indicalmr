import { useEffect, useState } from 'react';
import style from './EditarDados.module.css';
import Fetch from '../classes/Fetch';
import InputMask from "react-input-mask";
import Utils from "../classes/Utils";
import { faPencil, faTrash, faCheck, faFloppyDisk, faCircleCheck, faCircleXmark, faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalConfirmacao from './ModalConfirmacao';

function EditarDados({ id }) {
    const fetch = new Fetch();
    const utils = new Utils();
    const [exibirModal, setExibirModal] = useState(false);
    const [mensagem, setMensagem] = useState(false);
    const [parceiro, setParceiro] = useState(null);
    const [editarNome, setEditarNome] = useState(false);
    const [editarCelular, setEditarCelular] = useState(false);
    const [editarSenha, setEditarSenha] = useState(false);
    const [senha, setSenha] = useState(null);
    const [confirmacao, setConfirmacao] = useState(null);
    const [exibirSenha, setExibirSenha] = useState(false);
    const [valSenha, setValSenha] = useState({
        minCaract: false,
        confirmacao: null
    });

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.buscarParceiro(id);
            setParceiro(dados);
        }
        buscarDados();
    }, [id]);

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

    function validarSenha() {
        setValSenha({
            minCaract: utils.validarSenha(senha, 0)
        });
    }

    function confirmarSenha() {
        confirmacao === senha ? setValSenha({ ...valSenha, confirmacao: true }) : setValSenha({ ...valSenha, confirmacao: false });
    }

    const exibirEdicaoSenha = () => {
        if (!editarSenha === false) {
            document.getElementById("senha").value = "";
            setConfirmacao(null);
            //document.getElementById("confirmacaoSenha").value = "";
        }
        setEditarSenha(!editarSenha)
    }

    const excluir = async () => {
        var resposta = await fetch.excluirConta();

        if (resposta) {
            return { ok: true, sucesso: true, mensagem: "Sua conta foi excluída" };
        } else {
            return { ok: true, sucesso: false, mensagem: "Ocorreu um erro ao excluir a sua conta" };
        }
    }

    const desconectar = () => {
        fetch.desconectar();
    };

    async function editar() {
        var nome = document.getElementById("nome").value;
        var celular = document.getElementById("celular").value.replace(/[()\-_ ]/g, '');

        if (nome === "") {
            setMensagem("Seu nome não pode ser vazio");
        } else if (celular === "") {
            setMensagem("Seu celular não pode ser vazio");
        } else {
            var resposta;

            if (senha) {
                if (valSenha.confirmacao === true) {
                    resposta = await fetch.editarDados(nome, celular, senha);
                } else {
                    setMensagem("Sua senha deve ser válida");
                }
            } else {
                resposta = await fetch.editarDados(nome, celular, "");
            }

            if (resposta) {
                setMensagem("Os dados foram atualizados");
            } else {
                setMensagem("Ocorreu um erro. Tente novamente");
            }
        }
    }

    function voltar() {
        window.location.href = '/';
    }

    return (
        <>
            {parceiro ?
                <div className={style.dados}>
                    <h1>Editar dados</h1>
                    <div className={style.formulario}>
                        <div className={style.campo}>
                            <input type="text" id="nome" placeholder="Nome e sobrenome" disabled={!editarNome} defaultValue={parceiro.nome} />
                            <p className={style.editardado}><FontAwesomeIcon icon={editarNome === false ? faPencil : faCheck} onClick={() => setEditarNome(!editarNome)} /></p>
                        </div>
                        <div className={style.campo}>
                            <InputMask mask="(99) 99999-9999" placeholder="Celular" disabled={!editarCelular} id="celular" type="tel" defaultValue={parceiro.telefone} />
                            <p className={style.editardado}><FontAwesomeIcon icon={editarCelular === false ? faPencil : faCheck} onClick={() => setEditarCelular(!editarCelular)} /></p>
                        </div>
                        <div className={style.campo}>
                            <input type={exibirSenha === false ? "password" : "text"} placeholder={editarSenha === false ? "•••••••••••••••" : "Senha"} disabled={!editarSenha} id="senha" onChange={(e) => setSenha(e.target.value)} />
                            <p className={style.editardado}><FontAwesomeIcon icon={editarSenha === false ? faPencil : faXmark} onClick={() => exibirEdicaoSenha()} /></p>
                            {editarSenha === true ? <p className={style.editardado}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p> : "" }
                        </div>
                        {editarSenha ?
                            <div className={style.requisitos}>
                                <h5>Sua senha deve conter:</h5>
                                <p className={valSenha.minCaract === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minCaract === true ? faCircleCheck : faCircleXmark} /> No mínimo 6 caracteres</p>
                            </div>
                        : ""}
                        {editarSenha === true ?
                            <>
                                <div className={style.campo}>
                                    <input placeholder="Confirmação da senha" id="confirmacaoSenha" type={exibirSenha === false ? "password" : "text"} onChange={(e) => setConfirmacao(e.target.value)} defaultValue={confirmacao} />
                                    <p className={style.editardado}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p>
                                </div>
                                {senha && valSenha.confirmacao !== null ?
                                    <div className={style.requisitos}>
                                        {valSenha.confirmacao === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> As senhas são iguais</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> As senhas devem ser iguais</p>}
                                    </div>
                                : ""}
                            </>
                        : ""}
                        {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                        <div className={style.botoes}>
                            <button onClick={() => voltar()}>Voltar</button>
                            <button className={style.salvardados} onClick={() => editar()}><FontAwesomeIcon icon={faFloppyDisk} /> Salvar</button>
                            <button className={style.excluir} onClick={() => setExibirModal(true)}><FontAwesomeIcon icon={faTrash} /> Excluir conta</button>
                        </div>
                    </div>
                </div>
            : ""}
            <ModalConfirmacao
                acao={excluir}
                onHide={() => setExibirModal(false)}
                show={exibirModal}
                titulo="Excluir conta"
                mensagemConfirmacao="Você tem certeza de que quer excluir sua conta? O seu saldo de crédito será zerado e você não poderá entrar na conta novamente"
                tituloBotao="Excluir mesmo assim"
                acaoPosterior={desconectar} />
        </>
    );
}

export default EditarDados;