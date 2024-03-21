import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalResgatar.module.css';
import Fetch from '../classes/Fetch';
import ItemPremioDisplay from './ItemPremioDisplay';

function ModalResgatar(props) {
    const fetch = new Fetch();

    const [saldoResgate, setSaldoResgate] = useState(props.saldo);
    const [valorSaldoResgate, setValorSaldoResgate] = useState(0);
    const [mensagem, setMensagem] = useState(null);
    const [concluido, setConcluido] = useState(false);
    const [exibirPremios, setExibirPremios] = useState(false);
    const [premios, setPremios] = useState(false);
    const [confirmarPremio, setConfirmarPremio] = useState(false);
    const [idPremioSelecionado, setIdPremioSelecionado] = useState(0);
    const [desselecionar, setDesselecionar] = useState(null);

    function fechar() {
        props.onHide();
        setIdPremioSelecionado(0);
        setConfirmarPremio(false);
        setExibirPremios(false);
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

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.listarPremiosDisponiveis();
            setPremios(dados);
        }
        buscarDados();
    }, [])

    const verificarStatus = () => {
        return confirmarPremio;
    }

    const selecionar = (status) => {
        setConfirmarPremio(status);
    }

    const definirIdPremio = (id) => {
        setIdPremioSelecionado(id);
    }

    const funcDesselecionar = (funcao) => {
        setDesselecionar(funcao);
    }

    const executarDessel = () => {
        desselecionar();
    }

    async function resgatarPremio() {
        if (idPremioSelecionado !== 0) {
            var resposta = await fetch.criarTransacao(props.usuario, 0, 2, idPremioSelecionado);
            if (resposta) {
                setConcluido(true);
                setMensagem("Seu prêmio foi resgatado! Compareça ao escritório para retirá-lo");

                var atualizacao = await fetch.atualizarUsuario();
                if (atualizacao) {
                    props.atualizar();
                }
            } else {
                setConcluido(true);
                setMensagem("Opa, parece que seu saldo de crédito é insuficiente. Tente novamente");
            }
        } else {
            setMensagem("Nenhum prêmio foi selecionado");
        }
    }

    async function resgatar() {
        if (valorSaldoResgate >= 10 && valorSaldoResgate <= props.saldo) {
            setMensagem(null);

            var resposta = await fetch.criarTransacao(props.usuario, valorSaldoResgate, 0, null);
            if (resposta) {
                setConcluido(true);
                setMensagem("Resgate registrado. Compareça à unidade física do escritório para receber");

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
                        {exibirPremios ? 
                            <>
                                <h1>Qual prêmio você deseja resgatar?</h1>
                                <div className={style.containerpremios}>
                                    {premios && premios.length > 0 ?
                                        premios.map((premio) => (
                                            <ItemPremioDisplay premio={premio} verificar={verificarStatus} selecionar={selecionar} definirId={definirIdPremio} desselecionar={funcDesselecionar} executarDessel={executarDessel} />
                                        ))
                                    : ""}
                                </div>
                            </>
                        :<>
                            <h1>{props.resgate === true ? "Qual é o valor do resgate?" : "Qual valor você deseja abater?"}</h1>
                            <p className={saldoResgate < 0 ? style.invalido : ""}>Saldo após o {props.resgate === true ? "resgate" : "abate"}: R$ {saldoResgate}</p>
                            <div className={style.valor}>
                                <p>R$</p>
                                <input placeholder="0,00" type="number" min={props.saldo < 10 ? 0 : 10} max={props.saldo} onChange={(e) => atualizarSaldoResgate(e.target)} id="valor" />
                            </div>
                            {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                        </>}
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                {concluido ?
                    <>
                        <Button onClick={() => fechar()}>Entendi</Button>
                    </> : <>
                        <Button onClick={() => fechar()}>Cancelar</Button>
                        <Button className={confirmarPremio === true ? style.btconfirmar : style.btresgatar} disabled={props.saldo >= 1 ? false : true} onClick={idPremioSelecionado === 0 ? () => setExibirPremios(true) : () => resgatarPremio()}>Resgatar prêmio</Button>
                        <Button className={style.btresgatar} disabled={props.saldo >= 1 ? false : true} onClick={exibirPremios === true ? () => setExibirPremios(false) : () => resgatar()}>{props.resgate === true ? "Resgatar valor" : "Abater"}</Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ModalResgatar;