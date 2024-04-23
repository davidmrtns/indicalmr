import { useState, useEffect } from 'react';
import style from './DadosParceiro.module.css';
import Fetch from '../classes/Fetch';
import { faCircleUser, faXmark, faGift, faFileContract, faFileSignature, faHandPointRight, faWallet, faPhone, faIdCard, faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Recursos from '../classes/Recursos';
import Utils from '../classes/Utils';
import ModalConfirmacao from './ModalConfirmacao';
import InputMask from "react-input-mask";

function DadosParceiro({ id, fechar }) {
    const fetch = new Fetch();
    const recursos = new Recursos();
    const utils = new Utils();
    const [parceiro, setParceiro] = useState(null);
    const [atualizar, setAtualizar] = useState(false);
    const [atualizarParceiro, setAtualizarParceiro] = useState(false);
    const [dados, setDados] = useState({
        lista: null,
        temMais: null
    });
    const [pagina, setPagina] = useState(1);
    const [exibirModal, setExibirModal] = useState(false);
    const [qtdIndicacoes, setQtdIndicacoes] = useState({
        total: 0,
        fechadas: 0
    });

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

    async function mudarStatusRepasse(id) {
        await fetch.mudarStatusRepasse(id);
        setAtualizar(!atualizar);
    }

    const atualizarQtdIndicacoes = async (idParceiro) => {
        setQtdIndicacoes({
            total: await fetch.contarIndicacoesId(idParceiro),
            fechadas: await fetch.contarIndicacoesFechadasId(idParceiro)
        });
    }

    useEffect(() => {
        const buscarDados = async () => {
            if (id != null) {
                var dados = await fetch.buscarParceiroId(id);
                setParceiro(dados);
                setPagina(1);
                setQtdIndicacoes({ total: 0, fechadas: 0 });

                if (dados.tipo === 1) {
                    atualizarQtdIndicacoes(dados.id);
                }
            }
        }

        buscarDados();
    }, [id, atualizarParceiro]);

    useEffect(() => {
        const buscarDados = async () => {
            if (id) {
                var itens = parceiro.tipo === 0 ? await fetch.listarTransacoesPorParceiro(id, pagina) : await fetch.listarIndicacoesPorId(id, pagina);
                setDados({ lista: parceiro.tipo === 0 ? itens.transacoes : itens.parceiros, temMais: itens.temMais });
            } else {
                setDados({ lista: null, temMais: null });
            }
        }
        buscarDados();
    }, [pagina, parceiro, atualizar]);

    if (id && parceiro) {
        return (
            <>
                <div className={style.dados}>
                    <p className={style.fechar}><FontAwesomeIcon onClick={() => fechar(null)} icon={faXmark} /></p>
                    <div className={style.nome}>
                        <p className={style.iconeconta}><FontAwesomeIcon icon={faCircleUser} /></p>
                        <h2>{parceiro.nome}</h2>
                        {parceiro.tipo === 0 ?
                            <>
                                <div className={style.informacoes}>
                                    <p title="Indicado por"><FontAwesomeIcon icon={faHandPointRight} /> {parceiro.idParceiro ? parceiro.indicadoPor : "[Não foi indicado]"}</p>
                                    <p title="CPF"><FontAwesomeIcon icon={faIdCard} /> {parceiro.cpf ? <InputMask mask="999.999.999-99" disabled value={parceiro.cpf} /> : "[Sem CPF]"}</p>
                                </div>
                                <div className={style.informacoes}>
                                    <p title="Número de telefone"><FontAwesomeIcon icon={faPhone} /> <InputMask mask="(99) 99999-9999" disabled value={parceiro.telefone} /></p>
                                    <p title="Saldo de crédito"><FontAwesomeIcon icon={faWallet} /> R$ {parceiro.credito},00</p>
                                </div>
                                <div className={style.statuscontrato}>
                                    {parceiro.fechou === true ? <p className={style.contratofechado}><FontAwesomeIcon icon={faFileContract} /> Fechou contrato</p> : <p className={style.contratoaberto}><FontAwesomeIcon icon={faFileSignature} /> Não fechou contrato</p>}
                                    {parceiro.fechou === false ? <button className={style.botaostatus} onClick={() => setExibirModal(true)}>Mudar o status do contrato</button> : ""}
                                </div>
                            </>    
                        :
                            <>
                                <h3 className={style.statusparceiro}><FontAwesomeIcon icon={faGem} title="Parceiro" /> Parceiro da LMR</h3>
                                <div className={style.informacoes}>
                                    <p title="CPF"><FontAwesomeIcon icon={faIdCard} /> {parceiro.cpf ? <InputMask mask="999.999.999-99" disabled value={parceiro.cpf} /> : "[Sem CPF]"}</p>
                                    <p title="Número de telefone"><FontAwesomeIcon icon={faPhone} /> <InputMask mask="(99) 99999-9999" disabled value={parceiro.telefone} /></p>
                                </div>
                                <div className={style.informacoes}>
                                    <p title="Indicações totais"><FontAwesomeIcon icon={faHandPointRight} /> {qtdIndicacoes.total} totais</p>
                                    <p title="Indicações que fecharam contrato"><FontAwesomeIcon icon={faFileSignature} /> {qtdIndicacoes.fechadas} fecharam</p>
                                </div>
                            </>}
                    </div>
                    <hr />
                    {parceiro.tipo === 0 ?
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
                                    {dados.lista && dados.lista.length > 0 ?
                                        dados.lista.map((transacao) => (
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
                                    <img src={recursos.getProximo()} alt="Próxima página" className={dados.temMais === false ? style.desabilitado : ""} onClick={() => dados.temMais === true ? setPagina(pagina + 1) : ""} />
                                </div>
                            </div>
                        </div>
                    : 
                        <div className={style.transacoes}>
                            <p>Indicações</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>CPF</th>
                                        <th>Celular</th>
                                        <th>Fechou?</th>
                                        <th>Repassado?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.lista && dados.lista.length > 0 ?
                                        dados.lista.map((indicacao) => (
                                            <tr>
                                                <td>{indicacao.nome}</td>
                                                <td>{indicacao.cpf ? <InputMask mask="999.999.999-99" disabled type="text" value={indicacao.cpf} /> : "[Sem CPF]"}</td>
                                                <td><InputMask mask="(99) 99999-9999" disabled type="tel" value={indicacao.telefone} /></td>
                                                <td>{indicacao.fechou ? <img src={recursos.getCheck()} alt="Fechou" /> : <img src={recursos.getCancelar()} alt="Não fechou" />}</td>
                                                <td><input type="checkbox" checked={indicacao.repassado} onClick={() => mudarStatusRepasse(indicacao.id)} /></td>
                                            </tr>
                                        ))
                                    : <tr><td colSpan={5}>Nenhuma indicação encontrada</td></tr>}
                                </tbody>
                            </table>
                            <div className={style.controles}>
                                <div>
                                    <img src={recursos.getRecarregar()} alt="Recarregar" onClick={() => setAtualizar(!atualizar)} />
                                </div>
                                <div>
                                    <img src={recursos.getAnterior()} alt="Página anterior" className={pagina === 1 ? style.desabilitado : ""} onClick={() => pagina > 1 ? setPagina(pagina - 1) : ""} />
                                    <p>{pagina}</p>
                                    <img src={recursos.getProximo()} alt="Próxima página" className={dados.temMais === false ? style.desabilitado : ""} onClick={() => dados.temMais === true ? setPagina(pagina + 1) : ""} />
                                </div>
                            </div>
                        </div>
                    }
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