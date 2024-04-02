import style from './Navbar.module.css';
import { faGear, faCircleUser, faGift, faMagnifyingGlass, faRightFromBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Recursos from "../classes/Recursos";
import Fetch from "../classes/Fetch";

function Navbar() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const LMRLogoVazado = recursos.getLMRLogoVazado();

    const desconectar = async () => {
        await fetch.desconectarEscritorio();
    }

    return (
        <div className={style.navbar}>
            <div className={style.logo} onClick={() => window.location.href = "/escritorio"}>
                <h1>Indica</h1>
                <LMRLogoVazado className={style.logolmr} />
            </div>
            <div className={style.links}>
                <div>
                    <a href="/escritorio"><FontAwesomeIcon icon={faMagnifyingGlass} /> Pesquisar</a>
                </div>
                <div>
                    <a href="/escritorio/novo-parceiro"><FontAwesomeIcon icon={faUserPlus} /> Novo parceiro</a>
                </div>
                <div>
                    <a href="/escritorio/configuracoes"><FontAwesomeIcon icon={faGear} /> Configurações</a>
                </div>
                <div>
                    <a href="/escritorio/premios"><FontAwesomeIcon icon={faGift} /> Prêmios</a>
                </div>
                <div>
                    <a href="/escritorio/usuarios"><FontAwesomeIcon icon={faCircleUser} /> Usuários</a>
                </div>
                <div>
                    <a href="/escritorio" onClick={() => desconectar()}><FontAwesomeIcon icon={faRightFromBracket} /> Sair</a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;