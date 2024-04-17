import style from './HomePage.module.css';
import Recursos from '../classes/Recursos';
import { useEffect, useState } from 'react';
import Fetch from '../classes/Fetch';
import ModalResgatar from '../components/ModalResgatar';
import ModalIndicar from '../components/ModalIndicar';
import ListaIndicacoes from '../components/ListaIndicacoes';
import ListaTransacoes from '../components/ListaTransacoes';
import ListaCobrancas from '../components/ListaCobrancas';
import { faRightFromBracket, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalAbater from '../components/ModalAbater';

function HomePage() {
    const recursos = new Recursos();
    const fetch = new Fetch();

    const [usuario, setUsuario] = useState(null);
    const [exibir, setExibir] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [modalResgatarShow, setModalResgatarShow] = useState(false);
    const [modalAbaterShow, setModalAbaterShow] = useState(false);
    const [modalIndicarShow, setModalIndicarShow] = useState(false);
    const [acoesConta, setAcoesConta] = useState(false);
    const [qtdIndicacoes, setQtdIndicacoes] = useState({
        total: 0,
        fechadas: 0
    })

    function editarDados() {
        window.location.href = "/editar-dados";
    }

    const atualizarCredito = async () => {
        var resposta = await fetch.atualizarCredito();
        if (resposta) {
            setAtualizar(!atualizar);
        }
    }

    const atualizarQtdIndicacoes = async () => {
        setQtdIndicacoes({
            total: await fetch.contarIndicacoes(),
            fechadas: await fetch.contarIndicacoesFechadas()
        });
    }

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.buscarUsuario();
            setUsuario(dados);

            if (dados.Tipo === 1) {
                atualizarQtdIndicacoes();
            }
        }

        buscarDados();
    }, [atualizar]);

    return (
        <div>
            <div className={style.cabecalho}>
                <div className={style.menuconta}>
                    <img className={style.conta} src={recursos.getConta()} alt="Conta" onClick={() => setAcoesConta(!acoesConta)} />
                    {acoesConta === true ?
                        <div className={style.blocoacao}>
                            <p onClick={() => editarDados()}><FontAwesomeIcon icon={faPencil} /> Editar dados</p>
                            <p onClick={() => fetch.desconectar()}><FontAwesomeIcon icon={faRightFromBracket} /> Desconectar</p>
                        </div>
                    : ""}
                </div>
                <h1>Olá, {usuario ? usuario.Nome : ""}</h1>
            </div>
            <div className={style.saldo}>
                {usuario ? usuario.Tipo === 0 ?
                    <>
                        <div className={style.exibir}>
                            <h1>Saldo de indicação</h1>
                            <p className={style.exibir} onClick={() => setExibir(!exibir)}>{exibir ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}</p>
                        </div>
                        <div>
                            <p>R$</p>
                            <p id="valor">{usuario ? exibir ? usuario.Credito + ",00" : "***" : ""} {exibir ? <FontAwesomeIcon icon={faArrowsRotate} className={style.atualizarcredito} onClick={() => atualizarCredito()} /> : ""}</p>
                        </div>
                    </>
                    : usuario.Tipo === 1 ?
                        <>
                            <div className={style.exibir}>
                                <h1>Suas indicações</h1>
                                <p className={style.exibir} onClick={() => atualizarQtdIndicacoes()}><FontAwesomeIcon icon={faArrowsRotate} /></p>
                            </div>
                            <div>
                                <p>{qtdIndicacoes.fechadas}</p><span>fecharam</span>
                                <p>{qtdIndicacoes.total}</p><span>totais</span>
                            </div>
                        </>
                    : "" : ""}
            </div>
            <div className={style.servicos}>
                <div>
                    <div id={style["indicar"]} className={style.servico} onClick={() => setModalIndicarShow(true)}>
                        <img className={style.icone} src={recursos.getIndicar()} />
                    </div>
                    <p>Indicar</p>
                </div>
                {usuario ? usuario.Tipo === 0 ?
                    <div>
                        <div id={style["resgatar"]} className={style.servico} onClick={() => setModalResgatarShow(true)}>
                            <img className={style.icone} src={recursos.getResgatar()} />
                        </div>
                        <p>Resgatar</p>
                    </div>
                : "" : ""}
                {usuario ? usuario.Tipo === 0 ?
                    <div>
                        <div id={style["abater"]} className={style.servico} onClick={() => setModalAbaterShow(true)}>
                            <img className={style.icone} src={recursos.getAbater()} />
                        </div>
                        <p>Abater</p>
                    </div>
                : "" : ""}
            </div>
            <div className={style.listas}>
                <ListaIndicacoes usuario={usuario} />
                {usuario ? usuario.Tipo == 0 ? <ListaTransacoes /> : "" : ""}
                {usuario ? usuario.Tipo === 0 ? <ListaCobrancas /> : "" : ""}
            </div>
            {usuario ?
                <>
                    {usuario.Tipo === 0 ?
                        <ModalResgatar
                            show={modalResgatarShow}
                            onHide={() => setModalResgatarShow(false)}
                            usuario={usuario.Id}
                            saldo={usuario.Credito}
                            resgate={true}
                            atualizar={() => setAtualizar(!atualizar)}
                        />
                    : ""}
                    {usuario.Tipo === 0 ?
                        <ModalAbater
                            show={modalAbaterShow}
                            onHide={() => setModalAbaterShow(false)}
                            usuario={usuario.Id}
                            saldo={usuario.Credito}
                            atualizar={() => setAtualizar(!atualizar)}
                        />
                    : ""}
                    <ModalIndicar
                        show={modalIndicarShow}
                        onHide={() => setModalIndicarShow(false)}
                        idParceiro={usuario.Id}
                    />
                </>
            : ""}
        </div>
    );
}

export default HomePage;