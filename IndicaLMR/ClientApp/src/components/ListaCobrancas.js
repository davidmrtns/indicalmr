import Recursos from "../classes/Recursos";
import style from "./ListaCobrancas.module.css";
import Fetch from "../classes/Fetch";
import { useState, useEffect } from "react";

function ListaCobrancas() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const [exibirLista, setExibirLista] = useState(false);
    const [lista, setLista] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [atualizar, setAtualizar] = useState(false);

    useEffect(() => {
        const buscarDados = async () => {
            var itens = await fetch.listarCobrancas();
            setLista(itens);
        }

        buscarDados();
    }, [pagina, atualizar]);

    const soma = () => {
        let soma = 0;

        lista.forEach(cobranca => {
            soma += cobranca.value
        });

        return soma;
    }

    return (
        <div className={style.indicacoes}>
            <p onClick={() => setExibirLista(!exibirLista)}>
                <img className={exibirLista === true ? style.colapsar + " " + style.aberto : style.colapsar} src={recursos.getSetaColapsar()} alt="colapsar" /> Cobranças
            </p>
            {exibirLista ?
                <>
                    {lista ?
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Data</th>
                                        <th scope="col">Descricao</th>
                                        <th scope="col">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.length >= 1 ?
                                        lista.map((cobranca) => (
                                            <tr>
                                                <td>{new Intl.DateTimeFormat('pt-BR', { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(cobranca.dateCreated))}</td>
                                                <td>{cobranca.description}</td>
                                                <td>R$ {cobranca.value}</td>
                                            </tr>
                                        ))
                                    : <tr><td colSpan="3">Você não tem nenhuma cobrança em aberto</td></tr>}
                                </tbody>
                                {lista.length >= 1 ?
                                    <tfoot>
                                        <tr>
                                            <th colSpan="2">Valor total</th>
                                            <td>R$ {soma()}</td>
                                        </tr>
                                    </tfoot>
                                : null}
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
            : <img className={style.icone} src={recursos.getCobranca()} alt="Cobranças" />}
        </div>
    );
}

export default ListaCobrancas;
