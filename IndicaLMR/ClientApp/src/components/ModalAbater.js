import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalResgatar.module.css';
import Fetch from '../classes/Fetch';

function ModalAbater(props) {
    const fetch = new Fetch();

    const [saldoResgate, setSaldoResgate] = useState(props.saldo);
    const [valorSaldoResgate, setValorSaldoResgate] = useState(0);
    const [mensagem, setMensagem] = useState(null);
    const [concluido, setConcluido] = useState(false);

    function fechar() {
        props.onHide();
        setMensagem(null);
        setConcluido(false);
    }

    function atualizarSaldoResgate(obj) {
        var valor = Math.floor(obj.value);
        setValorSaldoResgate(valor);

        if (valor >= 0) {
            setSaldoResgate(props.saldo - valor);
        }
    }

    async function resgatar() {
        if (valorSaldoResgate >= 10 && valorSaldoResgate <= props.saldo) {
            setMensagem(null);

            var resposta = await fetch.criarTransacao(props.usuario, valorSaldoResgate, 1, null);
            if (resposta) {
                setConcluido(true);
                setMensagem("O abate no valor dos honorários foi registrado");

                var atualizacao = await fetch.atualizarUsuario();
                if (atualizacao) {
                    props.atualizar();
                }
            } else {
                alert("Opa, parece que seu saldo de crédito é insuficiente. Tente novamente");
            }
        } else if (props.saldo === 0) {
            setMensagem("Você não tem saldo disponível");
        } else if (valorSaldoResgate <= 0) {
            setMensagem("Insira um valor válido");
        } else if (valorSaldoResgate < 10) {
            setMensagem("O valor mínimo para resgate é de R$ 10,00");
        } else {
            setMensagem("O valor inserido é maior do que o saldo disponível");
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
                {concluido ?
                    <>
                        <h1>Sucesso!</h1>
                        <p>{mensagem}</p>
                    </> : <>
                        <h1>{props.resgate === true ? "Qual é o valor do resgate?" : "Qual valor você deseja abater?"}</h1>
                        <p className={saldoResgate < 0 ? style.invalido : ""}>Saldo após o {props.resgate === true ? "resgate" : "abate"}: R$ {saldoResgate}</p>
                        <div className={style.valor}>
                            <p>R$</p>
                            <input placeholder="0,00" type="number" min={props.saldo < 10 ? 0 : 10} max={props.saldo} onChange={(e) => atualizarSaldoResgate(e.target)} id="valor" />
                        </div>
                        {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                {concluido ?
                    <>
                        <Button onClick={() => fechar()}>Entendi</Button>
                    </> : <>
                        <Button onClick={() => fechar()}>Cancelar</Button>
                        <Button className={style.btresgatar} disabled={props.saldo >= 1 ? false : true} onClick={() => resgatar()}>{props.resgate === true ? "Resgatar valor" : "Abater"}</Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAbater;