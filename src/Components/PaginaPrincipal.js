import NavBar from './navbar';
import Footer from './Footer';
import BarraBusqueda from './BarraBusqueda';
import ListaEventos from './ListaEventos';
import { useState } from 'react';
import { getSecureUserData } from '../utils/securityHelpers';

function PaginaPrincipal() {
        
    const user = getSecureUserData();
    console.log("Usuario actual:", user);
    
    const [filtros, setFiltros] = useState({
        busqueda: '',
        fecha: '',
        categoria: ''
    });
    
    return (
        
        <>
            <NavBar />
            <BarraBusqueda filtros={filtros} setFiltros={setFiltros} />
            <h1>   Eventos disponibles</h1>
            <ListaEventos filtros={filtros} />
            <Footer />
        </>
    );
}

export default PaginaPrincipal;

