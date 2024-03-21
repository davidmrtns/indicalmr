import { useEffect, useState } from 'react';
import style from './EditarDados.module.css';
import Fetch from '../classes/Fetch';
import InputMask from "react-input-mask";
import Utils from "../classes/Utils";
import { faPencil, faTrash, faCheck, faFloppyDisk, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function EditarDados({ id }) {
    const fetch = new Fetch();
    const utils = new Utils();
    const [mensagem, setMensagem] = useState(false);
    const [parceiro, setParceiro] = useState(null);
    const [editarNome, setEditarNome] = useState(false);
    const [editarCelular, setEditarCelular] = useState(false);
    const [editarSenha, setEditarSenha] = useState(false);
    const [senha, setSenha] = useState(null);
    const [confirmacao, setConfirmacao] = useState(null);
    const [valSenha, setValSenha] = useState({
        minCaract: false,
        caractEspec: false,
        minNum: false,
        minMinusc: false,
        minMaiusc: false,
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
            minCaract: utils.validarSenha(senha, 0),
            caractEspec: utils.validarSenha(senha, 1),
            minNum: utils.validarSenha(senha, 2),
            minMinusc: utils.validarSenha(senha, 3),
            minMaiusc: utils.validarSenha(senha, 4)
        });
    }

    function confirmarSenha() {
        confirmacao === senha ? setValSenha({ ...valSenha, confirmacao: true }) : setValSenha({ ...valSenha, confirmacao: false });
    }

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
                            <input type="password" placeholder={editarSenha === false ? "•••••••••••••••" : "Senha"} disabled={!editarSenha} id="senha" onChange={(e) => setSenha(e.target.value)} />
                            <p className={style.editardado}><FontAwesomeIcon icon={editarSenha === false ? faPencil : faCheck} onClick={() => setEditarSenha(!editarSenha)} /></p>
                        </div>
                        {editarSenha ?
                            <div className={style.requisitos}>
                                <h5>Sua senha deve conter:</h5>
                                <p className={valSenha.minCaract === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minCaract === true ? faCircleCheck : faCircleXmark} /> No mínimo 8 caracteres</p>
                                <p className={valSenha.caractEspec === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.caractEspec === true ? faCircleCheck : faCircleXmark} /> No mínimo 1 caractere especial</p>
                                <p className={valSenha.minNum === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minNum === true ? faCircleCheck : faCircleXmark} /> No mínimo 1 número</p>
                                <p className={valSenha.minMinusc === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minMinusc === true ? faCircleCheck : faCircleXmark} /> No mínimo 1 letra minúscula</p>
                                <p className={valSenha.minMaiusc === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minMaiusc === true ? faCircleCheck : faCircleXmark} /> No mínimo 1 letra maiúscula</p>
                            </div>
                        : ""}
                        {editarSenha === true ?
                            <>
                                <div className={style.campo}>
                                    <input placeholder="Confirmação da senha" id="confirmacaoSenha" type="password" onChange={(e) => setConfirmacao(e.target.value)} defaultValue={confirmacao} />
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
                        </div>
                    </div>
                </div>
            : ""}
        </>
    );
}

export default EditarDados;