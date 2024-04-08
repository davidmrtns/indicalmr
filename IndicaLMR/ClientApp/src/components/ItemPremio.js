import { useState } from "react";
import styles from "./ItemPremio.module.css";
import { faPencil, faXmark, faFloppyDisk, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fetch from "../classes/Fetch";
import ModalConfirmacao from "./ModalConfirmacao";

function ItemPremio({ adicionar, premio, atualizar }) {
    const fetch = new Fetch();
    const [edicao, setEdicao] = useState(false);
    const [exibirModal, setExibirModal] = useState(false);
    const [mensagemModal, setMensagemModal] = useState(null);

    async function criar() {
        var nome = document.getElementById("nome").value;
        var valor = document.getElementById("valor").value;
        var disponivel = document.getElementById("disponibilidade").value === "true" ? true : false;
        var descricao = document.getElementById("descricao").value;

        if (nome && valor && disponivel && descricao) {
            var resposta = await fetch.criarPremio(nome, valor, descricao, disponivel);
            if (resposta) {
                atualizar();
                setEdicao(false);
                alert("Prêmio criado");
            } else {
                alert("Ocorreu um erro");
            }
        } else {
            alert("Preencha os campos corretamente");
        }
    }

    async function editar() {
        var id = premio.id;
        var nome = document.getElementById("nome").value;
        var valor = document.getElementById("valor").value;
        var disponivel = document.getElementById("disponibilidade").value === "true" ? true : false;
        var descricao = document.getElementById("descricao").value;

        if (nome && valor && disponivel !== null && descricao) {
            var resposta = await fetch.editarPremio(id, nome, valor, descricao, disponivel, premio);
            if (resposta) {
                atualizar();
                setEdicao(false);
                alert("Prêmio atualizado");
            } else {
                alert("Ocorreu um erro");
            }
        } else {
            alert("Preencha os campos corretamente");
        }
    }

    const excluir = async () => {
        var id = premio.id;
        var resposta = await fetch.excluirPremio(id);

        if (resposta) {
            return { ok: true, sucesso: true, mensagem: "Prêmio excluído com sucesso" };
        } else {
            return { ok: true, sucesso: false, mensagem: "Ocorreu um erro ao tentar excluir" };
        }
    }

    if (adicionar === true) {
        if (edicao === false) {
            return (
                <div className={styles.premio + " " + styles.edicao}>
                    <div>
                        <div>
                            <h2>Adicionar prêmio</h2>
                        </div>
                        <div className={styles.divacao}>
                            <p><FontAwesomeIcon className={styles.acao} icon={faPlus} onClick={() => setEdicao(!edicao)} /></p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.premio + " " + styles.edicao}>
                    <div>
                        <div>
                            <input id="nome" placeholder="Nome do prêmio" type="text" />
                        </div>
                        <div>
                            <input id="valor" placeholder="Valor do prêmio (pontos)" type="number" />
                        </div>
                        <div>
                            <select id="disponibilidade">
                                <option value="true">Disponível</option>
                                <option value="false">Indisponível</option>
                            </select>
                        </div>
                        <div className={styles.divacao}>
                            <p><FontAwesomeIcon className={styles.acao} icon={faFloppyDisk} onClick={() => criar()} /></p>
                            <p><FontAwesomeIcon className={styles.acao} icon={faXmark} onClick={() => setEdicao(!edicao)} /></p>
                        </div>
                    </div>
                    <div className={styles.divdescricao}>
                        <p>Descrição</p>
                        <textarea id="descricao"></textarea>
                    </div>
                </div>
            );
        }
    } else if (edicao === false) {
        return (
            <>
                <div className={styles.premio}>
                    <div className={styles.nome}>
                        <p>{premio.nome}</p>
                    </div>
                    <div>
                        <p>R$ {premio.valor}</p>
                    </div>
                    <div className={styles.descricao}>
                        <p>{premio.descricao}</p>
                    </div>
                    <div>
                        <p>{premio.disponivel === true ? "Disponível" : "Indisponível"}</p>
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
                    titulo="Excluir prêmio"
                    mensagemConfirmacao="A exclusão de um prêmio é uma ação irreversível. Considere desativá-lo caso não queira que fique disponível para os parceiros"
                    tituloBotao="Excluir mesmo assim"
                    acaoPosterior={atualizar} />
            </>
        );
    } else {
        return (
            <div className={styles.premio + " " + styles.edicao}>
                <div>
                    <div>
                        <input id="nome" placeholder="Nome do prêmio" type="text" defaultValue={premio.nome} />
                    </div>
                    <div>
                        <input id="valor" placeholder="Valor do prêmio" type="number" defaultValue={premio.valor} />
                    </div>
                    <div>
                        <select id="disponibilidade">
                            <option selected={premio.disponivel === true ? true : false} value="true">Disponível</option>
                            <option selected={premio.disponivel === false ? true : false} value="false">Indisponível</option>
                        </select>
                    </div>
                    <div className={styles.divacao}>
                        <p><FontAwesomeIcon className={styles.acao} icon={faFloppyDisk} onClick={() => editar()} /></p>
                        <p><FontAwesomeIcon className={styles.acao} icon={faXmark} onClick={() => setEdicao(!edicao)} /></p>
                    </div>
                </div>
                <div className={styles.divdescricao}>
                    <p>Descrição</p>
                    <textarea id="descricao">{premio.descricao}</textarea>
                </div>
            </div>
        );
    }
}

export default ItemPremio;
