import { useState } from "react";
import styles from "./ItemUsuario.module.css";
import { faPencil, faXmark, faFloppyDisk, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fetch from "../classes/Fetch";
import ModalConfirmacao from "./ModalConfirmacao";

function ItemUsuario({ adicionar, usuario, atualizar }) {
    const fetch = new Fetch();
    const [edicao, setEdicao] = useState(false);
    const [exibirModal, setExibirModal] = useState(false);
    const [mensagemModal, setMensagemModal] = useState(null);

    async function criar() {
        var nome = document.getElementById("nome").value;
        var email = document.getElementById("email").value;
        var senha = document.getElementById("senha").value;
        var admin = document.getElementById("admin").value === "true" ? true : false;

        if (nome && email && senha && admin !== null) {
            var resposta = await fetch.criarUsuario(nome, email, senha, admin);
            if (resposta) {
                atualizar();
                setEdicao(false);
                alert("Usuário criado");
            } else {
                alert("Ocorreu um erro");
            }
        } else {
            alert("Preencha os campos corretamente");
        }
    }

    async function editar() {
        var id = usuario.id;
        var nome = document.getElementById("nome").value;
        var email = document.getElementById("email").value;
        var senha = document.getElementById("senha").value;
        var admin = document.getElementById("admin").value === "true" ? true : false;

        if (nome && email && admin !== null) {
            var resposta = await fetch.editarUsuario(id, nome, email, senha, admin, usuario);
            if (resposta) {
                atualizar();
                setEdicao(false);
                alert("Usuário atualizado");
            } else {
                alert("Ocorreu um erro");
            }
        } else {
            alert("Preencha os campos corretamente");
        }
    }

    const excluir = async () => {
        var id = usuario.id;
        var resposta = await fetch.excluirUsuario(id);

        if (resposta) {
            return { ok: true, sucesso: true, mensagem: "Usuário excluído com sucesso" };
        } else {
            return { ok: true, sucesso: false, mensagem: "Ocorreu um erro ao tentar excluir o usuário" };
        }
    }

    if (adicionar === true) {
        if (edicao === false) {
            return (
                <div className={styles.usuario + " " + styles.edicao}>
                    <div>
                        <div>
                            <h2>Adicionar usuário</h2>
                        </div>
                        <div className={styles.divacao}>
                            <p><FontAwesomeIcon className={styles.acao} icon={faPlus} onClick={() => setEdicao(!edicao)} /></p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.usuario + " " + styles.edicao}>
                    <div>
                        <div>
                            <input id="nome" placeholder="Nome do usuário" type="text" />
                        </div>
                        <div>
                            <input id="email" placeholder="E-mail" type="email" />
                        </div>
                        <div>
                            <input id="senha" placeholder="Senha" type="password" />
                        </div>
                        <div>
                            <select id="admin">
                                <option value="true">Administrador</option>
                                <option value="false">Usuário comum</option>
                            </select>
                        </div>
                        <div className={styles.divacao}>
                            <p><FontAwesomeIcon className={styles.acao} icon={faFloppyDisk} onClick={() => criar()} /></p>
                            <p><FontAwesomeIcon className={styles.acao} icon={faXmark} onClick={() => setEdicao(!edicao)} /></p>
                        </div>
                    </div>
                </div>
            );
        }
    } else if (edicao === false) {
        return (
            <>
                <div className={styles.usuario}>
                    <div className={styles.nome}>
                        <p>{usuario.nome}</p>
                    </div>
                    <div>
                        <p>{usuario.email}</p>
                    </div>
                    <div>
                        <p>{usuario.administrador === true ? "Administrador" : "Usuário comum"}</p>
                    </div>
                    <div className={styles.divacao}>
                        <p><FontAwesomeIcon className={styles.acao} icon={faPencil} onClick={() => setEdicao(!edicao)} /></p>
                        <p><FontAwesomeIcon className={styles.acao} icon={faTrash} onClick={() => setExibirModal(true)} /></p>
                    </div>
                </div>
                <ModalConfirmacao
                    acao={excluir}
                    onHide={() => setExibirModal(false)}
                    show={exibirModal}
                    titulo="Excluir usuário"
                    mensagemConfirmacao="Tem certeza de que quer excluir este usuário? Essa ação não pode ser desfeita"
                    tituloBotao="Excluir mesmo assim"
                    acaoPosterior={atualizar} />
            </>
        );
    } else {
        return (
            <div className={styles.usuario + " " + styles.edicao}>
                <div>
                    <div>
                        <input id="nome" placeholder="Nome do usuário" type="text" defaultValue={usuario.nome} />
                    </div>
                    <div>
                        <input id="email" placeholder="E-mail" type="email" defaultValue={usuario.email} />
                    </div>
                    <div>
                        <input id="senha" placeholder="•••••••••••••••" type="password" />
                    </div>
                    <div>
                        <select id="admin">
                            <option selected={usuario.administrador === true ? true : false} value="true">Administrador</option>
                            <option selected={usuario.administrador === false ? true : false} value="false">Usuário comum</option>
                        </select>
                    </div>
                    <div className={styles.divacao + " " + styles.divacaomenor}>
                        <p><FontAwesomeIcon className={styles.acao} icon={faFloppyDisk} onClick={() => editar()} /></p>
                        <p><FontAwesomeIcon className={styles.acao} icon={faXmark} onClick={() => setEdicao(!edicao)} /></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ItemUsuario;
