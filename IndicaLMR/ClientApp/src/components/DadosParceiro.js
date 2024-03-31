import { useState, useEffect } from 'react';
import style from './DadosParceiro.module.css';
import Fetch from '../classes/Fetch';
import { faCircleUser, faXmark, faGift, faFileContract, faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Recursos from '../classes/Recursos';
import Utils from '../classes/Utils';
import ModalConfirmacao from './ModalConfirmacao';

function DadosParceiro({ id, fechar }) {
    const fetch = new Fetch();
    const recursos = new Recursos();
    const utils = new Utils();
    const [parceiro, setParceiro] = useState(null);
    const [atualizar, setAtualizar] = useState(false);
    const [atualizarParceiro, setAtualizarParceiro] = useState(false);
    const [lista, setLista] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [exibirModal, setExibirModal] = useState(false);

    const mudarStatusParceiro = async () => {
        var resposta = await fetch.mudarStatusParceiro(id);

        if (resposta) {
            return { ok: true, sucesso: true, mensagem: "Status atualizado com sucesso" };
        } else {
            return { ok: true, sucesso: false, mensagem: "Um erro ocorreu. Tente novamente" };
        }
    }

    async function mudarStatusTransacao(id) {
        await fetch.mudarStatusTransacao(id);
        setAtualizar(!atualizar);
    }

    useEffect(() => {
        const buscarDados = async () => {
            if (id != null) {
                var dados = await fetch.buscarParceiroId(id);
                setParceiro(dados);
            }
        }

        buscarDados();
    }, [id, atualizarParceiro]);

    useEffect(() => {
        const buscarDados = async () => {
            var itens = await fetch.listarTransacoesPorParceiro(id, pagina);
            setLista(itens);
        }

        buscarDados();
    }, [pagina, id, atualizar]);

    if (id && parceiro) {
        return (
            <>
                <div className={style.dados}>
                    <p className={style.fechar}><FontAwesomeIcon onClick={() => fechar(null)} icon={faXmark} /></p>
                    <div className={style.nome}>
                        <p className={style.iconeconta}><FontAwesomeIcon icon={faCircleUser} /></p>
                        <h2>{parceiro.nome}</h2>
                        <p>Crédito: R$ {parceiro.credito},00</p>
                        {parceiro.fechou === true ? <p className={style.contratofechado}><FontAwesomeIcon icon={faFileContract} /> Fechou contrato</p> : <p className={style.contratoaberto}><FontAwesomeIcon icon={faFileSignature} /> Não fechou contrato</p>}
                        {parceiro.fechou === false ? <button className={style.botaostatus} onClick={() => setExibirModal(true)}>Mudar o status do contrato</button> : ""}
                    </div>
                    <hr />
                    <div className={style.transacoes}>
                        <p>Transações</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Valor</th>
                                    <th>Tipo</th>
                                    <th>Baixa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista && lista.length > 0 ?
                                    lista.map((transacao) => (
                                        <tr>
                                            <td>{utils.formatarData(transacao.data)}</td>
                                            <td>R$ {transacao.valor}</td>
                                            <td>{transacao.tipo === 0 ? "Resgate" : transacao.tipo === 1 ? "Abate" : <p className={style.premioresgatado}><FontAwesomeIcon icon={faGift} /> {transacao.nomePremio}</p>}</td>
                                            <td><input type="checkbox" checked={transacao.baixa} onClick={() => mudarStatusTransacao(transacao.id)} /></td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan={4}>Nenhuma transação encontrada</td></tr>}
                            </tbody>
                        </table>
                        <div className={style.controles}>
                            <div>
                                <img src={recursos.getRecarregar()} alt="Recarregar" onClick={() => setAtualizar(!atualizar)} />
                            </div>
                            <div>
                                <img src={recursos.getAnterior()} alt="Página anterior" className={pagina === 1 ? style.desabilitado : ""} onClick={() => pagina > 1 ? setPagina(pagina - 1) : ""} />
                                <p>{pagina}</p>
                                <img src={recursos.getProximo()} alt="Próxima página" className={lista && lista.length < 5 ? style.desabilitado : ""} onClick={() => lista && lista.length === 5 ? setPagina(pagina + 1) : ""} />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalConfirmacao
                    acao={mudarStatusParceiro}
                    onHide={() => setExibirModal(false)}
                    show={exibirModal}
                    titulo="Mudar status do contrato"
                    mensagemConfirmacao="Você tem certeza de que quer mudar o status do contrato deste parceiro? Essa ação só pode ser feita uma vez e quem indicou este parceiro terá seu saldo de indicação atualizado"
                    tituloBotao="Mudar status"
                    acaoPosterior={() => setAtualizarParceiro(!atualizarParceiro)} />
            </>
        );
    }
}

export default DadosParceiro;