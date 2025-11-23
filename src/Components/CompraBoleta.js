import Footer from "./Footer"
import NavBar from "./navbar"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import { MapPin, Calendar, Clock, Tag, Ticket, DollarSign, Info } from 'lucide-react'
import compraBoleta from '../Styles/CompraBoleta.module.css'
import Loader from './Loader'

function CompraBoleta() {

    const navigate = useNavigate();
    const { id } = useParams();
    
    const [evento, setEvento] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    
    // Obtener evento al montar el componente y actualizar cada 5 segundos
    useEffect(() => {
        if (!id) {
            setCargando(false);
            return;
        }
        
        // Función para obtener y actualizar los datos del evento
        const obtenerEvento = async () => {
            try {
                const response = await fetch(`https://localhost:7047/api/Eventos/${id}`);
                if (response.ok) {
                    const eventoData = await response.json();
                    setEvento(eventoData);
                    setError(null);
                    if (cargando) setCargando(false);
                } else if (response.status === 404) {
                    if (cargando) {
                        setError('Evento no encontrado');
                        setCargando(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Evento no encontrado',
                            text: 'El evento que buscas no existe o ha sido eliminado.',
                            confirmButtonText: 'Volver'
                        }).then(() => {
                            navigate('/PaginaPrincipal');
                        });
                    }
                } else {
                    throw new Error('Error al obtener el evento');
                }
            } catch (error) {
                if (cargando) {
                    setError('Error de conexión');
                    setCargando(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
                        confirmButtonText: 'Volver'
                    }).then(() => {
                        navigate('/PaginaPrincipal');
                    });
                }
            }
        };
        
        // Obtener evento inmediatamente
        obtenerEvento();
        
        // Actualizar cada 5 segundos
        const intervalo = setInterval(obtenerEvento, 5000);
        
        return () => clearInterval(intervalo);
    }, [id, navigate]);
    
    if (cargando) {
        return <Loader />;
    }
    
    if (error || !evento) {
        return null; // El error ya se maneja con el Swal
    }

    const fechaCompleta = new Date(evento.fecha);
    const fecha = fechaCompleta.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const hora = fechaCompleta.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });


    const IrAEspecificacionCompra = () => {
        // Verificar si hay un usuario logueado
        const token = Cookies.get('token');
        
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión requerida',
                text: 'Debes iniciar sesión para poder comprar boletas.',
                confirmButtonText: 'Iniciar Sesión',
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }
        
        navigate(`/especificacionCompra/${evento.id_Evento}`);
    }

return (
    <>
    <NavBar/>
    <div className={compraBoleta.container}>
        <div className={compraBoleta.content}>

        {/* Columna izquierda - Imagen y descripción */}
        <div className={compraBoleta.leftColumn}>
            {/* Imagen del evento */}
            <div className={compraBoleta.imageContainer}>
                {evento.imagen ? (
                    <img 
                        src={`data:image/jpeg;base64,${evento.imagen}`} 
                        alt={evento.nombre_Evento}
                        className={compraBoleta.eventImage}
                    />
                ) : (
                    <div className={compraBoleta.imagePlaceholder}>
                        <Info size={48} />
                        <p>Sin imagen disponible</p>
                    </div>
                )}
                <div className={compraBoleta.categoryBadge}>
                    <Tag size={16} />
                    {evento.categoria}
                </div>
            </div>

            {/* Título del evento */}
            <h1 className={compraBoleta.eventTitle}>{evento.nombre_Evento}</h1>

            {/* Descripción */}
            <div className={compraBoleta.descriptionCard}>
                <h3 className={compraBoleta.sectionTitle}>
                    <Info size={20} />
                    Descripción del evento
                </h3>
                <p className={compraBoleta.description}>{evento.descripcion}</p>
            </div>
        </div>

        {/* Columna derecha - Información y compra */}
        <div className={compraBoleta.rightColumn}>
            {/* Card de información */}
            <div className={compraBoleta.infoCard}>
                <h2 className={compraBoleta.cardTitle}>Información del Evento</h2>

                <div className={compraBoleta.infoGrid}>
                    <div className={compraBoleta.infoItem}>
                        <div className={compraBoleta.infoIcon}>
                            <Calendar size={20} />
                        </div>
                        <div className={compraBoleta.infoContent}>
                            <span className={compraBoleta.infoLabel}>Fecha</span>
                            <span className={compraBoleta.infoValue}>{fecha}</span>
                        </div>
                    </div>

                    <div className={compraBoleta.infoItem}>
                        <div className={compraBoleta.infoIcon}>
                            <Clock size={20} />
                        </div>
                        <div className={compraBoleta.infoContent}>
                            <span className={compraBoleta.infoLabel}>Hora</span>
                            <span className={compraBoleta.infoValue}>{hora}</span>
                        </div>
                    </div>

                    <div className={compraBoleta.infoItem}>
                        <div className={compraBoleta.infoIcon}>
                            <MapPin size={20} />
                        </div>
                        <div className={compraBoleta.infoContent}>
                            <span className={compraBoleta.infoLabel}>Lugar</span>
                            <span className={compraBoleta.infoValue}>{evento.nombre_Lugar}</span>
                        </div>
                    </div>

                    <div className={compraBoleta.infoItem}>
                        <div className={compraBoleta.infoIcon}>
                            <MapPin size={20} />
                        </div>
                        <div className={compraBoleta.infoContent}>
                            <span className={compraBoleta.infoLabel}>Dirección</span>
                            <span className={compraBoleta.infoValue}>{evento.direccion_Lugar}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card de precio y disponibilidad */}
            <div className={compraBoleta.purchaseCard}>
                <div className={compraBoleta.priceSection}>
                    <div className={compraBoleta.priceLabel}>
                        <DollarSign size={20} />
                        Precio por entrada
                    </div>
                    <div className={compraBoleta.priceValue}>
                        ${evento.precioTicket}
                    </div>
                </div>

                <div className={compraBoleta.availabilitySection}>
                    <div className={compraBoleta.availabilityLabel}>
                        <Ticket size={20} />
                        Entradas disponibles
                    </div>
                    <div className={`${compraBoleta.availabilityValue} ${
                        evento.tickets_Disponible < 10 ? compraBoleta.lowStock : 
                        evento.tickets_Disponible < 50 ? compraBoleta.mediumStock : 
                        compraBoleta.highStock
                    }`}>
                        {evento.tickets_Disponible > 0 ? evento.tickets_Disponible : 'Agotado'}
                    </div>
                    {evento.tickets_Disponible < 20 && evento.tickets_Disponible > 0 && (
                        <div className={compraBoleta.stockWarning}>
                            ¡Últimas entradas disponibles!
                        </div>
                    )}
                </div>

                <button 
                    className={compraBoleta.buyButton}
                    onClick={IrAEspecificacionCompra}
                    disabled={evento.tickets_Disponible === 0}
                >
                    {evento.tickets_Disponible > 0 ? 'Comprar Entradas' : 'Agotado'}
                </button>

                <div className={compraBoleta.statusBadge}>
                    <div className={`${compraBoleta.statusDot} ${evento.estado ? compraBoleta.statusOpen : compraBoleta.statusClosed}`}></div>
                    {evento.estado ? "Evento Abierto" : "Evento Cerrado"}
                </div>
            </div>
        </div>

    </div>
    </div>
    <Footer/>
    </>
    )
}
export default CompraBoleta