import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalIndicar.module.css';
import Fetch from '../classes/Fetch';
import Utils from '../classes/Utils';
import InputMask from "react-input-mask";

function ModalIndicar(props) {
    const fetch = new Fetch();

    const [mensagem, setMensagem] = useState(null);
    const [concluido, setConcluido] = useState({
        ok: false,
        sucesso: false
    });

    function fechar() {
        props.onHide();
        resetar();
    }

    function resetar() {
        setMensagem(null);
        setConcluido(false);
    }

    async function indicar() {
        var nome = document.getElementById("nome").value.replace(/\s+/g, " ").trim();
        var celular = document.getElementById("celular").value.replace(/[()\-_ ]/g, '');

        if (nome !== '' && celular.length === 11) {
            setMensagem(null);

            var resposta = await fetch.criarIndicacao(props.idParceiro, nome, celular);
            if (resposta != null) {
                var status = resposta.status;

                if (status === 200) {
                    setConcluido({
                        ok: true,
                        sucesso: true
                    });
                    setMensagem("Indicação concluída");
                } else if (status === 409) {
                    setConcluido({
                        ok: true,
                        sucesso: false
                    });
                    setMensagem("Parece que essa pessoa já foi indicada por alguém ou já é cliente da LMR...");
                } else if (status === 400) {
                    setConcluido({
                        ok: true,
                        sucesso: false
                    });
                    setMensagem("Ocorreu um erro, tente novamente");
                }
            }
        } else {
            setMensagem("Digite um CPF e celular válidos");
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                {concluido.ok ? 
                    <>
                        <h1>{concluido.sucesso ? "Sucesso!" : "Ops..."}</h1>
                        <p>{mensagem}</p>
                    </> : <>
                        <h1>Indicar</h1>
                        <div className={style.dados}>
                            <label>Nome</label>
                            <input placeholder="___________________" id="nome" type="text" />
                            <label>Celular</label>
                            <InputMask mask="(99) 99999-9999" placeholder="(__) _____-____" id="celular" type="tel" />
                        </div>
                        {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                    </>    
                }
            </Modal.Body>
            <Modal.Footer>
                {concluido.ok ?
                    <>
                        <Button onClick={() => fechar()}>Fechar</Button>
                        {concluido.sucesso === false ?
                            <Button className={style.btindicar} onClick={() => resetar()}>Indicar outra pessoa</Button>
                            : ""
                        }
                    </> : <>
                        <Button onClick={() => fechar()}>Cancelar</Button>
                        <Button className={style.btindicar} onClick={() => indicar()}>Indicar</Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ModalIndicar;