import React, { Children, Component, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Fetch from '../classes/Fetch';
import Login from '../components/Login';

function PrivateRoute() {
    var fetch = new Fetch();
    const [logado, setLogado] = useState(null);

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const logado = await fetch.checarLogin();
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
                <Outlet />
            );
        } else {
            return (
                <Login />
            );
        }
    }

    return (
        <div id="conteudogeral">
            {renderizar()}
        </div>
    );
}

export default PrivateRoute;