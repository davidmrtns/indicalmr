import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalResgatar.module.css';
import Fetch from '../classes/Fetch';
import ItemPremioDisplay from './ItemPremioDisplay';

function ModalResgatar(props) {
    const fetch = new Fetch();

    const [saldoResgate, setSaldoResgate] = useState(null);
    const [valorSaldoResgate, setValorSaldoResgate] = useState(0);
    const [status, setStatus] = useState({
        concluido: false,
        sucesso: true,
        mensagem: null
    });
    const [exibirPremios, setExibirPremios] = useState(false);
    const [premios, setPremios] = useState(false);
    const [confirmarPremio, setConfirmarPremio] = useState(false);
    const [idPremioSelecionado, setIdPremioSelecionado] = useState(0);
    const [desselecionar, setDesselecionar] = useState(null);
    const [realEmPonto, setRealEmPonto] = useState(null);

    useEffect(() => {
        const obterDados = async () => {
            var valor = await fetch.obterRealPonto();
            setRealEmPonto(valor);
            setSaldoResgate(valor * props.saldo);
        }
        obterDados();
    }, [])

    function fechar() {
        props.onHide();
        setIdPremioSelecionado(0);
        setConfirmarPremio(false);
        setExibirPremios(false);
        setSaldoResgate(props.saldo * realEmPonto);
        setStatus({
            concluido: false,
            sucesso: true,
            mensagem: null
        });
    }

    const atualizarSaldoResgate = (valor) => {
        setValorSaldoResgate(valor);

        if (valor > 0) {
            setSaldoResgate((props.saldo * realEmPonto) - valor);
        } else {
            setSaldoResgate(props.saldo * realEmPonto);
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
                setStatus({
                    concluido: true,
                    sucesso: true,
                    mensagem: "Seu prêmio foi resgatado! Compareça ao escritório para retirá-lo"
                });

                var atualizacao = await fetch.atualizarUsuario();
                if (atualizacao) {
                    props.atualizar();
                }
            } else {
                setStatus({
                    concluido: true,
                    sucesso: false,
                    mensagem: "Parece que seu saldo de crédito é insuficiente"
                });
            }
        } else {
            setStatus({
                mensagem: "Nenhum prêmio foi selecionado"
            });
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
                {status.concluido ?
                    <>
                        <h1>{status.sucesso ? "Sucesso!" : "Ops..."}</h1>
                        <p>{status.mensagem}</p>
                    </> : <>
                        <>
                            <h1>Qual prêmio você deseja resgatar?</h1>
                            <p className={style.conversao}>R$ 1,00 = {realEmPonto} ponto(s)</p>
                            <p className={saldoResgate < 0 ? style.invalido : ""}>Saldo após o resgate: {saldoResgate} pontos ~ R$ {saldoResgate / realEmPonto},00</p>
                            <div className={style.containerpremios}>
                                {premios && premios.length > 0 ?
                                    premios.map((premio) => (
                                        <ItemPremioDisplay premio={premio} verificar={verificarStatus} selecionar={selecionar} definirId={definirIdPremio} desselecionar={funcDesselecionar} executarDessel={executarDessel} atualizarSaldo={atualizarSaldoResgate} />
                                    ))
                                : ""}
                            </div>
                        </>
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                {status.concluido ?
                    <>
                        <Button onClick={() => fechar()}>Entendi</Button>
                    </> : <>
                        <Button onClick={() => fechar()}>Cancelar</Button>
                        <Button className={confirmarPremio === true ? style.btconfirmar : style.btresgatar} disabled={saldoResgate >= 0 ? false : true} onClick={idPremioSelecionado === 0 ? () => setExibirPremios(true) : () => resgatarPremio()}>Resgatar prêmio</Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ModalResgatar;