import React, { useEffect, useState } from 'react';
import CartaEvento from '../Components/CartaEvento';
import ListaEventosStyle from '../Styles/ListaEventos.module.css';
import { ServerOff, Calendar, Search, Wifi, Music, Theater, Trophy, PartyPopper } from 'lucide-react';

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
            <div className={ListaEventosStyle.loadingContainer}>
                <div className={ListaEventosStyle.loadingCard}>
                    <div className={ListaEventosStyle.spinner}></div>
                    <h3>Cargando eventos...</h3>
                    <p>Espera un momento mientras buscamos los mejores eventos para ti</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={ListaEventosStyle.emptyStateContainer}>
                <div className={ListaEventosStyle.emptyCard}>
                    <div className={ListaEventosStyle.iconWrapper} style={{ backgroundColor: '#fee2e2' }}>
                        <ServerOff size={48} color="#ef4444" />
                    </div>
                    <h2 className={ListaEventosStyle.emptyTitle}>Error de conexión</h2>
                    <p className={ListaEventosStyle.emptyMessage}>
                        No pudimos conectar con el servidor. Por favor, verifica que el servidor esté activo e intenta nuevamente.
                    </p>
                    <button 
                        className={ListaEventosStyle.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        <Wifi size={20} />
                        Reintentar conexión
                    </button>
                </div>
            </div>
        );
    }

    // Obtener categorías únicas de los eventos filtrados
    const categorias = [...new Set(eventosFiltrados.map(evento => evento.categoria))];
    
    // Iconos para cada categoría
    const getIconoCategoria = (categoria) => {
        const iconos = {
            'Concierto': <Music size={24} />,
            'Teatro': <Theater size={24} />,
            'Deportes': <Trophy size={24} />,
            'Fiesta': <PartyPopper size={24} />
        };
        return iconos[categoria] || <Calendar size={24} />;
    };

    return (
        <div className={ListaEventosStyle.mainContainer}>
            {eventosFiltrados.length === 0 ? (
                <div className={ListaEventosStyle.emptyStateContainer}>
                    <div className={ListaEventosStyle.emptyCard}>
                        <div className={ListaEventosStyle.iconWrapper} style={{ backgroundColor: eventos.length > 0 ? '#dbeafe' : '#fef3c7' }}>
                            {eventos.length > 0 ? <Search size={48} color="#3b82f6" /> : <Calendar size={48} color="#f59e0b" />}
                        </div>
                        <h2 className={ListaEventosStyle.emptyTitle}>
                            {eventos.length > 0 ? 'No se encontraron eventos' : 'No hay eventos disponibles'}
                        </h2>
                        <p className={ListaEventosStyle.emptyMessage}>
                            {eventos.length > 0 
                                ? 'Intenta ajustar los filtros de búsqueda para encontrar eventos que se adapten a tus intereses.'
                                : 'Actualmente no hay eventos programados. Vuelve pronto para descubrir nuevas experiencias.'}
                        </p>
                        {eventos.length > 0 && (
                            <button 
                                className={ListaEventosStyle.clearButton}
                                onClick={() => window.location.reload()}
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Sección: Todos los eventos */}
                    {!filtros.categoria && !filtros.busqueda && !filtros.fecha && (
                        <div className={ListaEventosStyle.categoriaSection}>
                            <div className={ListaEventosStyle.categoriaHeader}>
                                <div className={ListaEventosStyle.categoriaIcono}>
                                    <Calendar size={24} />
                                </div>
                                <h2 className={ListaEventosStyle.categoriaTitulo}>Todos los Eventos</h2>
                                <span className={ListaEventosStyle.categoriaCount}>
                                    {eventosFiltrados.length} {eventosFiltrados.length === 1 ? 'evento' : 'eventos'}
                                </span>
                            </div>
                            <div className={ListaEventosStyle.container}>
                                {eventosFiltrados.map(evento => (
                                    <CartaEvento key={evento.id_Evento} evento={evento} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Si hay filtros activos, mostrar solo los resultados filtrados */}
                    {(filtros.categoria || filtros.busqueda || filtros.fecha) && (
                        <div className={ListaEventosStyle.container}>
                            {eventosFiltrados.map(evento => (
                                <CartaEvento key={evento.id_Evento} evento={evento} />
                            ))}
                        </div>
                    )}

                    {/* Secciones por categoría (solo si no hay filtros activos) */}
                    {!filtros.categoria && !filtros.busqueda && !filtros.fecha && categorias.map(categoria => {
                        const eventosCategoria = eventosFiltrados.filter(e => e.categoria === categoria);
                        return (
                            <div key={categoria} className={ListaEventosStyle.categoriaSection}>
                                <div className={ListaEventosStyle.categoriaHeader}>
                                    <div className={ListaEventosStyle.categoriaIcono}>
                                        {getIconoCategoria(categoria)}
                                    </div>
                                    <h2 className={ListaEventosStyle.categoriaTitulo}>{categoria}</h2>
                                    <span className={ListaEventosStyle.categoriaCount}>
                                        {eventosCategoria.length} {eventosCategoria.length === 1 ? 'evento' : 'eventos'}
                                    </span>
                                </div>
                                <div className={ListaEventosStyle.container}>
                                    {eventosCategoria.map(evento => (
                                        <CartaEvento key={evento.id_Evento} evento={evento} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}

export default ListaEventos;
