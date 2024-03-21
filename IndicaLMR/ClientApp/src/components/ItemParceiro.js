import { faEye, faGift, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './ItemParceiro.module.css';
import InputMask from "react-input-mask";
import Fetch from '../classes/Fetch';
import { Tooltip } from "react-tooltip";

function ItemParceiro({ parceiro, transacao, exibir, atualizar }) {
    const fetch = new Fetch();

    async function mudarStatus(id) {
        await fetch.mudarStatusTransacao(id);
        alert('Status alterado');
        atualizar();
    }

    if (parceiro) {
        return (
            <div className={style.container}>
                <div className={style.nome}>
                    <p>{parceiro.nome}</p>
                </div>
                <div>
                    <InputMask mask="(99) 99999-9999" disabled value={parceiro.telefone} />
                </div>
                <div>
                    {parceiro.cpf ? <InputMask mask="999.999.999-99" disabled value={parceiro.cpf} /> : <p className={style.semcpf}>(Sem CPF)</p>}
                </div>
                <div className={style.exibir}>
                    <FontAwesomeIcon icon={faEye} onClick={() => exibir(parceiro.id)} />
                </div>
            </div>
        );
    } else {
        return (
            <div className={transacao.baixa === false ? style.container : style.container + " " + style.baixado}>
                <div className={style.nome}>
                    <p>{transacao.data}</p>
                </div>
                <div>
                    <p>{transacao.nomeParceiro}</p>
                </div>
                <div>
                    <p>R$ {transacao.valor}</p>
                </div>
                <div>
                    <p>{transacao.tipo === 0 ? "Resgate" : transacao.tipo === 1 ? "Abate" : <p><FontAwesomeIcon icon={faGift} /> {transacao.nomePremio}</p>}</p>
                </div>
                <div>
                    <p>{transacao.baixa === true ? "Baixado" : "Em aberto"}</p>
                </div>
                <div className={style.exibir}>
                    <FontAwesomeIcon icon={faClipboardCheck} onClick={() => mudarStatus(transacao.id)} data-tooltip-id="tooltip-1" />
                    <Tooltip id="tooltip-1" arrowColor="transparent" variant="info" content="Alternar status da transação" />
                </div>
            </div>
        );
    }
}

export default ItemParceiro;
