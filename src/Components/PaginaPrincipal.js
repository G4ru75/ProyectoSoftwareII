import NavBar from './navbar';
import Footer from './Footer';
import BarraBusqueda from './BarraBusqueda';
import ListaEventos from './ListaEventos';
import { useState } from 'react';
import { getSecureUserData } from '../utils/securityHelpers';
import { Sparkles } from 'lucide-react';
import '../Styles/PaginaPrincipal.css';

function PaginaPrincipal() {
        
    const user = getSecureUserData();
    const [filtros, setFiltros] = useState({
        busqueda: '',
        fecha: '',
        categoria: ''
    });
    
    return (
        
        <>
            <NavBar />
            <div className="eventos-header">
                <div className="eventos-header-content">
                    <Sparkles className="eventos-icon" size={28} />
                    <h1 className="eventos-title">Descubre Eventos Increíbles</h1>
                    <p className="eventos-subtitle">Encuentra la experiencia perfecta para ti</p>
                </div>
                <div className="barra-busqueda-wrapper">
                    <BarraBusqueda filtros={filtros} setFiltros={setFiltros} />
                </div>
            </div>
            <ListaEventos filtros={filtros} />
            <Footer />
        </>
    );
}

export default PaginaPrincipal;

