import InputMask from "react-input-mask";
import Fetch from "../classes/Fetch";
import Recursos from "../classes/Recursos";
import { useEffect, useState } from "react";
import style from './SearchPage.module.css';
import ItemParceiro from "../components/ItemParceiro";
import { faMagnifyingGlass, faShuffle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DadosParceiro from "../components/DadosParceiro";
import ModalAlterarSenha from "../components/ModalAlterarSenha";

function SearchPage() {
    var fetch = new Fetch();
    var recursos = new Recursos();
    const [modoPesquisa, setModoPesquisa] = useState({
        parceiro: false,
        transacao: true
    });
    const [dados, setDados] = useState({
        lista: null,
        temMais: null
    });
    const [pagina, setPagina] = useState(1);
    const [tamPagina, setTamPagina] = useState(5);
    const [idParceiro, setIdParceiro] = useState(null);
    const [idAlterarSenha, setIdAlterarSenha] = useState(null);
    const [atualizar, setAtualizar] = useState(false);
    const [exibirModal, setExibirModal] = useState(false);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    function botaoPesquisar() {
        setPagina(1);
        pesquisar();
    }

    async function pesquisar() {
        var nome = document.getElementById("nome").value.replace(/\s+/g, " ").trim().toUpperCase();
        var cpf = document.getElementById("cpf").value.replace(/[.\-_]/g, '');
        var tipo = modoPesquisa.transacao === true ? (document.getElementById("tipo").value === '-' ? '' : document.getElementById("tipo").value) : "";
        var tipoParceiro = modoPesquisa.parceiro === true ? (document.getElementById("tipoParceiro").value === '-' ? '' : document.getElementById("tipoParceiro").value) : "";
        var fechou = modoPesquisa.parceiro === true ? (document.getElementById("fechou").value === '-' ? '' : document.getElementById("fechou").value) : "";
        var foiIndicado = modoPesquisa.parceiro === true ? (document.getElementById("foiIndicado").value === '-' ? '' : document.getElementById("foiIndicado").value) : "";
        var baixa = modoPesquisa.transacao === true ? (document.getElementById("baixa").value == 0 ? 'false' : document.getElementById("baixa").value == 1 ? 'true' : '') : "";
        var tamanho = document.getElementById("tamPagina").value;

        var itens = modoPesquisa.transacao === true ? await fetch.listarTransacoesFiltro(pagina, tamanho, tipo, baixa, nome, cpf) : await fetch.listarParceiros(nome, cpf, tipoParceiro, fechou, foiIndicado, pagina, tamanho);
        setTamPagina(tamanho)
        setDados({ lista: modoPesquisa.transacao === true ? itens.transacoes : itens.parceiros, temMais: itens.temMais });
    }

    function alterarModo() {
        setDados({ lista: null, temMais: null });
        setPagina(1);
        setModoPesquisa({
            parceiro: !modoPesquisa.parceiro,
            transacao: !modoPesquisa.transacao
        });
        setAtualizar(!atualizar);
    }

    const atualizarId = (novoId) => {
        setIdParceiro(novoId);
    }

    useEffect(() => {
        pesquisar();
    }, [pagina, atualizar]);

    const abrirModal = (id) => {
        setExibirModal(true);
        setIdAlterarSenha(id);
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.caixapesquisa}>
                    <div className={style.pesquisa}>
                        <div>
                            <input type="text" placeholder="Nome" id="nome" />
                        </div>
                        <div>
                            <InputMask mask="999.999.999-99" placeholder="CPF" id="cpf" type="text" />
                        </div>
                        {modoPesquisa.parceiro === true ?
                           <div>
                                <select id="tipoParceiro">
                                    <option value="-">Todos</option>
                                    <option selected value="0">Indicador</option>
                                    <option value="1">Parceiro</option>
                                </select>
                           </div>
                            : ""}
                        {modoPesquisa.parceiro === true ?
                            <div>
                                <select id="fechou">
                                    <option value="-">Todos</option>
                                    <option selected value="0">Não fechou</option>
                                    <option value="1">Fechou</option>
                                </select>
                            </div>
                            : ""}
                        {modoPesquisa.parceiro === true ?
                            <div>
                                <select id="foiIndicado">
                                    <option selected value="-">Indiferente</option>
                                    <option value="0">Não foi indicado</option>
                                    <option selected value="1">Foi indicado</option>
                                </select>
                            </div>
                            : ""}
                        {modoPesquisa.transacao === true ?
                            <div>
                                <select id="tipo">
                                    <option selected value="-">Todos</option>
                                    <option value="0">Resgate</option>
                                    <option value="1">Abate</option>
                                    <option value="2">Prêmio</option>
                                </select>
                            </div>
                            : ""}
                        {modoPesquisa.transacao === true ?
                            <div>
                                <select id="baixa">
                                    <option value="-">Indiferente</option>
                                    <option selected value="0">Em aberto</option>
                                    <option value="1">Baixado</option>
                                </select>
                            </div>
                            : ""}
                        <div className={style.botao}>
                            <select id="tamPagina">
                                <option>5</option>
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                            <button title="Mudar modo de pesquisa" onClick={() => alterarModo()}><FontAwesomeIcon icon={faShuffle} /></button>
                            <button title="Pesquisar" onClick={() => botaoPesquisar()}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </div>
                    </div>
                    <div className={style.resultados}>
                        <h1>{modoPesquisa.transacao === true ? "Transações" : "Indicadores"}</h1>
                        {dados.lista && dados.lista.length > 0 ?
                            modoPesquisa.parceiro === true ?
                                dados.lista.map((parceiro) => (
                                    <ItemParceiro parceiro={parceiro} exibir={atualizarId} abrirModal={abrirModal} />
                                ))
                                : dados.lista.map((transacao) => (
                                    <ItemParceiro transacao={transacao} atualizar={() => setAtualizar(!atualizar)} />
                                )) : <p>Nenhum resultado encontrado</p>
                        }
                    </div>
                    {dados.lista && dados.lista.length > 0 ?
                        <div className={style.controles}>
                            <img src={recursos.getAnterior()} alt="Página anterior" className={pagina === 1 ? style.desabilitado : ""} onClick={() => pagina > 1 ? setPagina(pagina - 1) : ""} />
                            <p>{pagina}</p>
                            <img src={recursos.getProximo()} alt="Próxima página" className={dados.temMais === false ? style.desabilitado : ""} onClick={() => dados.temMais === true ? setPagina(pagina + 1) : ""} />
                        </div>
                        : ""}
                </div>
                <DadosParceiro id={idParceiro} fechar={atualizarId} />
                <ModalAlterarSenha id={idAlterarSenha} onHide={() => setExibirModal(false)} show={exibirModal} />
            </div>
        </>
    );
}

export default SearchPage;