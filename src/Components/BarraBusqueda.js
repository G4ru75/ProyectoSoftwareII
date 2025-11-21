import react from 'react';
import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import BarraBusquedaStyle from '../Styles/BarraBusqueda.module.css';

function BarraBusqueda({ filtros, setFiltros }) {

    const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
    const [Categorias, setCategorias] = useState([]); 

    useEffect(() => {
            fetch("https://localhost:7047/api/Categorias")
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al cargar categorías');
                }
                return res.json();
            })
            .then(data => {
                setCategorias(data);
            })
            .catch(error => {
                console.error("Error al obtener categorías:", error);
                // No mostrar error al usuario, simplemente dejar las categorías vacías
            });
        }, []);


    const toggleFiltros = () => {
        setFiltrosAbiertos(!filtrosAbiertos);
    };

    const handleBusquedaChange = (e) => {
        setFiltros({ ...filtros, busqueda: e.target.value });
    };

    const handleFechaChange = (e) => {
        setFiltros({ ...filtros, fecha: e.target.value });
    };

    const handleCategoriaChange = (e) => {
        setFiltros({ ...filtros, categoria: e.target.value });
    };

    const handleLimpiarFiltros = () => {
        setFiltros({ busqueda: '', fecha: '', categoria: '' });
    };

    return (
        <>
            <div className={BarraBusquedaStyle.searchBar}>
            <input 
                type="text" 
                placeholder="BUSCAR...." 
                className={BarraBusquedaStyle.searchInput}
                value={filtros.busqueda}
                onChange={handleBusquedaChange}
            />

            {/* aqui se ve normal pantallas normales */}
            <div className={BarraBusquedaStyle.filtersDesktop}>
            <input 
                type="date" 
                placeholder="Fecha" 
                className={BarraBusquedaStyle.filter}
                value={filtros.fecha}
                onChange={handleFechaChange}
            />
            <select 
                className={BarraBusquedaStyle.filter}
                value={filtros.categoria}
                onChange={handleCategoriaChange}
            >
                <option value="" >Categoria</option>
                {Categorias.map((cat) => (
                        <option key={cat.id_Categoria} value={cat.nombre}>{cat.nombre}</option>
                ))}
            </select>
            </div>

            {/* Botón de filtros para pantallas pequeñas */}
            <button className={BarraBusquedaStyle.filterToggle} onClick={toggleFiltros} aria-expanded={filtrosAbiertos}>
            {filtrosAbiertos ? <X size={20} /> : <Filter size={20} />}
            <span>Filtros</span>
            </button>

            <button className={BarraBusquedaStyle.searchButton} onClick={handleLimpiarFiltros} type="button" title="Limpiar filtros">
            <X size={30} color="white" strokeWidth={4} />
            </button>
        </div>

        {/* Panel de filtros para móvil */}
        {filtrosAbiertos && (
            <div className={BarraBusquedaStyle.filtersMobile}>
            <div className={BarraBusquedaStyle.filterItem}>
                <label>Fecha:</label>
                <input 
                    type="date" 
                    className={`${BarraBusquedaStyle.filter} ${BarraBusquedaStyle.FondoBlanco}`}
                    value={filtros.fecha}
                    onChange={handleFechaChange}
                />
            </div>
            <div className={BarraBusquedaStyle.filterItem}>
                <label>Categoría:</label>
                <select 
                    className={`${BarraBusquedaStyle.filter} ${BarraBusquedaStyle.FondoBlanco}`}
                    value={filtros.categoria}
                    onChange={handleCategoriaChange}
                >
                <option value="" >Selecciona una categoria</option>
                {Categorias.map((cat) => (
                        <option key={cat.id_Categoria} value={cat.nombre}>{cat.nombre}</option>
                ))}
                </select>
            </div>
            </div>
        )}

        </>
    );
}


export default BarraBusqueda;