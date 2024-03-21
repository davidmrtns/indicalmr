import HomePage from "./paginas/HomePage";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import PrivateRoute from "./paginas/PrivateRoute";
import PrivateRouteEscritorio from "./paginas/PrivateRouteEscritorio";
import SearchPage from "./paginas/SearchPage";
import EditarDados from "./components/EditarDados";
import SettingsPage from "./paginas/SettingsPage";
import GiftsPage from "./paginas/GiftsPage";
import UsersPage from "./paginas/UsersPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute />}>
                <Route index path="" element={<HomePage />} />
                <Route path="editar-dados" element={<EditarDados />} />
            </Route>
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/escritorio" element={<PrivateRouteEscritorio />}>
                <Route path="" element={<SearchPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
                <Route path="premios" element={<GiftsPage />} />
                <Route path="usuarios" element={<UsersPage />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
