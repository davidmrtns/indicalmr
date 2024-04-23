import Recursos from "../classes/Recursos";
import style from "./ListaIndicacoes.module.css";
import Fetch from "../classes/Fetch";
import { useState, useEffect } from "react";

function ListaIndicacoes({ usuario }) {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const [exibirLista, setExibirLista] = useState(false);
    const [dados, setDados] = useState({
        lista: null,
        temMais: null
    });
    const [pagina, setPagina] = useState(1);
    const [atualizar, setAtualizar] = useState(false);

    useEffect(() => {
        const buscarDados = async () => {
            var itens = await fetch.listarIndicacoes(pagina);
            setDados({ lista: itens.parceiros, temMais: itens.temMais });
        }

        buscarDados();
    }, [pagina, atualizar]);

    return (
        <div className={style.indicacoes}>
            <p onClick={() => setExibirLista(!exibirLista)}>
                <img className={exibirLista === true ? style.colapsar + " " + style.aberto : style.colapsar} src={recursos.getSetaColapsar()} alt="colapsar" /> Indicações
            </p>
            {exibirLista ?
                <>
                    {dados.lista ?
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Telefone</th>
                                        <th scope="col">Fechou contrato?</th>
                                        {usuario.Tipo === 1 ? <th scope="col">Percentual repassado?</th> : ""}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.lista.length >= 1 ?
                                        dados.lista.map((indicacao) => (
                                            <tr>
                                                <td>{indicacao.nome}</td>
                                                <td>{indicacao.telefone}</td>
                                                <td>{indicacao.fechou ? <img src={recursos.getCheck()} alt="Fechou" /> : <img src={recursos.getCancelar()} alt="Não fechou" />}</td>
                                                {usuario.Tipo === 1 ? <td>{indicacao.repassado === true ? <img src={recursos.getCheck()} alt="Repassado" /> : <img src={recursos.getCancelar()} alt="Não repassado" />}</td> : ""}
                                            </tr>
                                        ))
                                        : <tr><td colSpan={usuario.Tipo === 1 ? 4 : 3}>Você ainda não fez nenhuma indicação</td></tr>
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
                                    <img src={recursos.getProximo()} alt="Próxima página" className={dados.temMais === false ? style.desabilitado : ""} onClick={() => dados.temMais === true ? setPagina(pagina + 1) : ""} />
                                </div>
                            </div>
                        </> :
                        <div className={style.carregando}>
                            <img src={recursos.getCarregando()} alt="Carregando" />
                        </div>
                    }
                </>
            : <img className={style.icone} src={recursos.getIndicacoes()} alt="Indicações" />}
        </div>
    );
}

export default ListaIndicacoes;
