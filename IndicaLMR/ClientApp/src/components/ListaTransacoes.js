import Recursos from "../classes/Recursos";
import style from "./ListaTransacoes.module.css";
import Fetch from "../classes/Fetch";
import { useState, useEffect } from "react";
import { faGift } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ListaTransacoes() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const [exibirLista, setExibirLista] = useState(false);
    const [lista, setLista] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [atualizar, setAtualizar] = useState(false);

    useEffect(() => {
        const buscarDados = async () => {
            var itens = await fetch.listarTransacoes(pagina);
            setLista(itens);
        }

        buscarDados();
    }, [pagina, atualizar]);

    return (
        <div className={style.indicacoes}>
            <p onClick={() => setExibirLista(!exibirLista)}>
                <img className={exibirLista === true ? style.colapsar + " " + style.aberto : style.colapsar} src={recursos.getSetaColapsar()} alt="Colapsar" /> Transações
            </p>
            {exibirLista ?
                <>
                    {lista ?
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Data</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.length >= 1 ?
                                        lista.map((transacao) => (
                                            <tr>
                                                <td>{transacao.data}</td>
                                                <td>R$ {transacao.valor}</td>
                                                <td>{transacao.tipo === 0 ? "Resgate" : transacao.tipo === 1 ? "Abate" : <p className={style.premioresgatado}><FontAwesomeIcon icon={faGift} /> {transacao.nomePremio}</p>}</td>
                                            </tr>
                                        ))
                                    : <tr><td colSpan="3">Você ainda não fez nenhuma transação</td></tr>
                                    }
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
                        </> :
                        <div className={style.carregando}>
                            <img src={recursos.getCarregando()} alt="Carregando" />
                        </div>
                    }
                </>
            : <img className={style.icone} src={recursos.getDinheiro()} alt="Transações" />}
        </div>
    );
}

export default ListaTransacoes;
