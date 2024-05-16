import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalAlterarSenha.module.css';
import Fetch from '../classes/Fetch';
import Utils from '../classes/Utils';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ModalAlterarSenha({ id, onHide, show }) {
    const utils = new Utils();
    const fetch = new Fetch();

    const [mensagem, setMensagem] = useState(null);
    const [concluido, setConcluido] = useState({
        ok: false,
        sucesso: false
    });
    const [senha, setSenha] = useState('');
    const [confirmacao, setConfirmacao] = useState('');
    const [valSenha, setValSenha] = useState(null);

    useEffect(() => {
        validarSenha();
        if (confirmacao) {
            confirmarSenha();
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

    function fechar() {
        cancelar();
    }

    function cancelar() {
        onHide();
        resetar();
    }

    function resetar() {
        setMensagem(null);
        setConcluido(false);
        setSenha('');
        setConfirmacao('');
    }

    async function editar() {
        var resposta;

        if (senha) {
            if (valSenha.confirmacao === true) {
                resposta = await fetch.atualizarSenhaParceiro(id, senha, confirmacao);
                setConcluido({ ok: true, sucesso: resposta });
            } else {
                setMensagem("Sua senha deve ser válida");
            }
        } else {
            setMensagem("Preencha uma senha");
        }

        if (resposta) {
            setMensagem("A senha foi atualizada");
        } else {
            setMensagem("Ocorreu um erro. Tente novamente");
        }
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
                        <h1>Alterar senha</h1>
                        <div className={style.campo}>
                            <input type="password" placeholder="Senha"  id="senha" onChange={(e) => setSenha(e.target.value)} />
                        </div>
                        {senha ? 
                            <div className={style.requisitos}>
                                <h5>A senha deve conter:</h5>
                                <p className={valSenha.minCaract === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minCaract === true ? faCircleCheck : faCircleXmark} /> No mínimo 6 caracteres</p>
                            </div>
                        : <br />}
                        <div>
                            <div className={style.campo}>
                                <input placeholder="Confirmação da senha" id="confirmacaoSenha" type="password" onChange={(e) => setConfirmacao(e.target.value)} defaultValue={confirmacao} />
                            </div>
                            {senha && valSenha.confirmacao !== null ?
                                <div className={style.requisitos}>
                                    {valSenha.confirmacao === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> As senhas são iguais</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> As senhas devem ser iguais</p>}
                                </div>
                            : ""}
                        </div>
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
                        <Button className={style.btsalvar} onClick={() => editar()}>Salvar</Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAlterarSenha;