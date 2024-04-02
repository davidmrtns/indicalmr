import React, { Children, Component, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Fetch from '../classes/Fetch';
import LoginEscritorio from '../components/LoginEscritorio';
import Navbar from '../components/Navbar';

function PrivateRouteEscritorio() {
    var fetch = new Fetch();
    const [logado, setLogado] = useState(null);

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const logado = await fetch.checarLoginEscritorio();
                setLogado(logado);
            } catch (error) {
                console.error('Erro ao buscar dados: ', error);
            }
        }

        buscarDados();
    }, []);

    function renderizar() {
        if (logado) {
            return (
                <>
                    <Navbar />
                    <Outlet />
                </>
            );
        } else {
            return (
                <LoginEscritorio />
            );
        }
    }

    return (
        <div id="conteudogeral">
            {renderizar()}
        </div>
    );
}

export default PrivateRouteEscritorio;