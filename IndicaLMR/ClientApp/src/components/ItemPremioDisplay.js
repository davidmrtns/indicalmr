﻿import { useState } from "react";
import styles from "./ItemPremioDisplay.module.css";
import { faPencil, faXmark, faFloppyDisk, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fetch from "../classes/Fetch";
import ModalConfirmacao from "./ModalConfirmacao";

function ItemPremioDisplay({ premio, verificar, selecionar, definirId, desselecionar, executarDessel }) {
    const fetch = new Fetch();
    const [edicao, setEdicao] = useState(false);
    const [exibirModal, setExibirModal] = useState(false);
    const [mensagemModal, setMensagemModal] = useState(null);
    const [premioSelecionado, setPremioSelecionado] = useState(false);

    function selecionarPremio() {
        var status = verificar();

        if (status === true) {
            if (premioSelecionado === true) {
                setPremioSelecionado(false);
                definirId(0);
                selecionar(false);
            } else {
                executarDessel();
                setPremioSelecionado(true);
                definirId(premio.id);
                selecionar(true);
                desselecionar(() => removerSelecao);
            }
        } else {
            setPremioSelecionado(true);
            definirId(premio.id);
            selecionar(true);
            desselecionar(() => removerSelecao);
        }
    }

    const removerSelecao = () => {
        setPremioSelecionado(false);
        definirId(0);
        selecionar(false);
    }

    return (
        <>
            <div className={premioSelecionado === true ? styles.premio + " " + styles.selecionado : styles.premio} onClick={() => selecionarPremio()}>
                <div className={styles.nome}>
                    <p>{premio.nome}</p>
                    <p className={styles.valor}>R$ {premio.valor}</p>
                </div>
                <div className={styles.descricao}>
                    <p>{premio.descricao}</p>
                </div>
            </div>
        </>
    );
}

export default ItemPremioDisplay;
