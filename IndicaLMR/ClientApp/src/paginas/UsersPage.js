import { useEffect, useState } from "react";
import Fetch from "../classes/Fetch";
import Navbar from "../components/Navbar";
import style from "./GiftsPage.module.css";
import { faPencil, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ItemUsuario from "../components/ItemUsuario";

function UsersPage() {
    const fetch = new Fetch();
    const [usuarios, setUsuarios] = useState(null);
    const [atualizar, setAtualizar] = useState(false);

    const atualizarLista = () => {
        setAtualizar(!atualizar);
    };

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.listarUsuarios();
            setUsuarios(dados);
        }
        buscarDados();
    }, [atualizar]);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    return (
        <>
            <div>
                <div>
                    <h1 className={style.titulo}>Usuários</h1>
                </div>
                <div className={style.container}>
                    <ItemUsuario adicionar={true} atualizar={atualizarLista} />
                    {usuarios && usuarios.length > 0 ?
                        usuarios.map((usuario) => (
                            <ItemUsuario usuario={usuario} atualizar={atualizarLista} />
                        ))
                        : ""}
                </div>
            </div>
        </>
    );
}

export default UsersPage;
