import { useEffect, useState } from "react";
import Recursos from "../classes/Recursos";
import Fetch from "../classes/Fetch";
import Navbar from "../components/Navbar";
import style from './SettingsPage.module.css';

function SettingsPage() {
    const fetch = new Fetch();
    const [configuracoes, setConfiguracoes] = useState(null);

    async function atualizarConfiguracao(chave){
        var valor = document.getElementById(chave).value;
        var resposta = await fetch.atualizarConfiguracao(chave, valor);

        if (resposta) {
            alert("Configuração atualizada com sucesso");
        } else {
            alert("Não foi possível atualizar a configuração")
        }
    }

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.listarConfiguracoes();
            setConfiguracoes(dados);
        }
        buscarDados();
    }, []);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    return (
        <div className={style.container}>
            <h1 className={style.titulo}>Configurações</h1>
            <div className={style.configuracoes}>
                {configuracoes && configuracoes.length > 0 ?
                    configuracoes.map((configuracao) => (
                        <div className={style.configuracao}>
                            <p>{configuracao.nome}</p>
                            <input id={configuracao.chave} defaultValue={configuracao.valor} type="number" />
                            <button onClick={() => atualizarConfiguracao(configuracao.chave)}>Salvar</button>
                        </div>
                    ))
                : ""}
            </div>
        </div>
    );
}

export default SettingsPage;