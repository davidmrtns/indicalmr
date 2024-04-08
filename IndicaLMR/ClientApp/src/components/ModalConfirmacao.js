import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalConfirmacao.module.css';
import Fetch from '../classes/Fetch';
import Utils from '../classes/Utils';
import InputMask from "react-input-mask";

function ModalConfirmacao({ acao, onHide, show, titulo, mensagemConfirmacao, tituloBotao, acaoPosterior }) {
    const [mensagem, setMensagem] = useState(null);
    const [concluido, setConcluido] = useState({
        ok: false,
        sucesso: false
    });

    async function executarAcao() {
        const resultado = await acao();
        setConcluido({ ok: resultado.ok, sucesso: resultado.sucesso });
        setMensagem(resultado.mensagem);
    }

    function fechar() {
        cancelar();
        acaoPosterior();
    }

    function cancelar() {
        onHide();
        resetar();
    }

    function resetar() {
        setMensagem(null);
        setConcluido(false);
    }

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className={style.corpo}>
                {concluido.ok ? 
                    <>
                        <h1>{concluido.sucesso ? "Sucesso!" : "Ops..."}</h1>
                        <p>{mensagem}</p>
                    </> : <>
                        <h1>{titulo}</h1>
                        <p>{mensagemConfirmacao}</p>
                        {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                    </>    
                }
            </Modal.Body>
            <Modal.Footer>
                {concluido.ok ?
                    <>
                        <Button onClick={() => fechar()}>Fechar</Button>
                    </> : <>
                        <Button onClick={() => cancelar()}>Cancelar</Button>
                        <Button className={style.btexcluir} onClick={() => executarAcao()}>{tituloBotao}</Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ModalConfirmacao;