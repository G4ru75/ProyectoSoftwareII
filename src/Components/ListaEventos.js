import React, { useEffect, useState } from 'react';
import CartaEvento from '../Components/CartaEvento';
import ListaEventosStyle from '../Styles/ListaEventos.module.css';
import { Cookie } from 'lucide-react';

function ListaEventos({ filtros }) {
    const [eventos, setEventos] = useState([]);
    const [eventosFiltrados, setEventosFiltrados] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    useEffect(() => {
        setCargando(true);
        setError(null);
        
        fetch('https://localhost:7047/api/Eventos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los eventos');
                }
                return response.json();
            })
            .then(data => {
                const EventosActivos = data.filter(evento => evento.estado == true)
                setEventos(EventosActivos);
                setEventosFiltrados(EventosActivos);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al obtener eventos:", error);
                setError('No se pudieron cargar los eventos. Por favor, verifica que el servidor esté activo.');
                setCargando(false);
            });
    }, []);

    useEffect(() => {
        let resultado = eventos;

        // Filtrar por búsqueda (nombre del evento)
        if (filtros.busqueda) {
            resultado = resultado.filter(evento =>
                evento.nombre_Evento.toLowerCase().includes(filtros.busqueda.toLowerCase())
            );
        }

        // Filtrar por fecha
        if (filtros.fecha) {
            resultado = resultado.filter(evento => {
                const fechaEvento = new Date(evento.fecha).toISOString().split('T')[0];
                return fechaEvento === filtros.fecha;
            });
        }

        // Filtrar por categoría
        if (filtros.categoria) {
            resultado = resultado.filter(evento =>
                evento.categoria === filtros.categoria
            );
        }

        setEventosFiltrados(resultado);
    }, [filtros, eventos]);

    if (cargando) {
        return (
            <div className={ListaEventosStyle.container}>
                <h5 className={ListaEventosStyle.mensaje}>Cargando eventos...</h5>
            </div>
        );
    }

    if (error) {
        return (
            <div className={ListaEventosStyle.container}>
                <h5 className={ListaEventosStyle.mensaje} style={{ color: '#ef4444' }}>{error}</h5>
            </div>
        );
    }

    return (
        <div className={ListaEventosStyle.container}>
            {eventosFiltrados.map(evento => (
                <CartaEvento key={evento.id_Evento} evento={evento} />
            ))
        }
            {
            eventosFiltrados.length === 0 ? (
                <h5 className={ListaEventosStyle.mensaje}>No hay eventos disponibles con los filtros seleccionados.</h5>
            ) : null}
            
        </div>
    );
}

export default ListaEventos;
