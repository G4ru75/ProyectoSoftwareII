import NavBar from './navbar';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Ticket from './Ticket';
import Swal from 'sweetalert2';
import Loader from './Loader';
import { ShoppingCart, Calendar, Tag, CreditCard, Ticket as TicketIcon, DollarSign, AlertCircle } from 'lucide-react';
import especificacionStyle from '../Styles/EspecificacionDeCompra.module.css';

function EspecificacionDeCompra({ handleClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const evento = location.state?.evento;

    const [cantidad, setCantidad] = useState(1);
    const [categoria, setCategoria] = useState(evento?.categoria || '');
    const [metodoPago, setMetodoPago] = useState('');
    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [Cargando, setCargando] = useState(false);
    const [ticketsDisponibles, setTicketsDisponibles] = useState(evento?.tickets_Disponible || 0);
    
    // Verificar si hay sesión al cargar el componente
    useEffect(() => {
        const token = Cookies.get('token');
        
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión requerida',
                text: 'Debes iniciar sesión para poder comprar boletas.',
                confirmButtonText: 'Iniciar Sesión',
                allowOutsideClick: false
            }).then(() => {
                navigate('/login');
            });
        }
    }, [navigate]); 

    const precio = evento?.precioTicket || 0;

    const calcularPrecioConCategoria = () => {
        let incremento = 0;
        switch (categoria) {
            case 'VIP':
                incremento = 0.15;
                break;
            case 'Premium':
                incremento = 0.20;
                break;
            case 'Estándar':
                incremento = 0.05;
                break;
            default:
                incremento = 0;
        }
        return precio + (precio * incremento);
    };

    const total = cantidad * calcularPrecioConCategoria();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!metodoPago) {
            Swal.fire({
                icon: 'warning',
                title: 'metodo de pago no seleccionada',
                text: 'Por favor, seleccione un metodo de pago para continuar.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        if (!categoria) {
            Swal.fire({
                icon: 'warning',
                title: 'Categoría no seleccionada',
                text: 'Por favor, seleccione una categoría para continuar.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        
        // Validar que la cantidad no exceda los tickets disponibles
        if (cantidad > ticketsDisponibles) {
            Swal.fire({
                icon: 'error',
                title: 'Cantidad no disponible',
                text: `Solo quedan ${ticketsDisponibles} tickets disponibles.`,
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        
        // Validar que haya tickets disponibles
        if (ticketsDisponibles <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Agotado',
                text: 'Lo sentimos, no hay tickets disponibles para este evento.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        const token = Cookies.get('token');
        const ticketDto = {
            Precio: calcularPrecioConCategoria(),
            Nombre_Evento: evento.nombre_Evento,
            Categoria: categoria,
            Fecha_Entrada: new Date(evento.fecha).toISOString(),
            Id_Evento: evento.id_Evento
        };

        setCargando(true);
        try {
            const res = await fetch(`https://localhost:7047/api/Tickets/${cantidad}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticketDto)
            });

            if (res.ok) {
                setCargando(false);
                
                // Actualizar tickets disponibles
                setTicketsDisponibles(prevTickets => prevTickets - cantidad);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Compra exitosa',
                    text: `Has comprado ${cantidad} entradas para el evento ${evento.nombre_Evento}.`,
                    confirmButtonText: 'Aceptar'
                });

                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                const resTickets = await fetch(`https://localhost:7047/api/Tickets/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (resTickets.ok) {
                    const data = await resTickets.json();
                    const ultimoTicket = data.tickets[data.tickets.length - 1];
                    setTicket(ultimoTicket);
                    setTicketModalOpen(true);
                }
            } else if (res.status === 404) {
                setCargando(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Recurso no encontrado',
                    text: 'El evento o ticket solicitado no existe.',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                setCargando(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error',
                    text: `No se pudo completar la compra. Por favor, inténtelo de nuevo más tarde.`,
                });
            }
        } catch (error) {
            setCargando(false);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    if (!evento) {
        return <p className='text-center mt-10 text-red-500'>No se ha seleccionado ningún evento.</p>;
    }

    return (
        <>
            <NavBar />
            <div className={especificacionStyle.container}>
                <div className={especificacionStyle.content}>
                    {/* Encabezado */}
                    <div className={especificacionStyle.header}>
                        <ShoppingCart size={32} />
                        <h1 className={especificacionStyle.title}>Finalizar Compra</h1>
                        <p className={especificacionStyle.subtitle}>Completa los detalles de tu compra</p>
                    </div>

                    <form onSubmit={handleSubmit} className={especificacionStyle.form}>
                        {/* Información del Evento */}
                        <div className={especificacionStyle.section}>
                            <h2 className={especificacionStyle.sectionTitle}>
                                <Calendar size={20} />
                                Información del Evento
                            </h2>
                            <div className={especificacionStyle.eventInfo}>
                                <div className={especificacionStyle.eventName}>
                                    {evento.nombre_Evento}
                                </div>
                                <div className={especificacionStyle.eventDetails}>
                                    <span>{new Date(evento.fecha).toLocaleDateString('es-ES', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                    <span className={especificacionStyle.separator}>•</span>
                                    <span>{evento.nombre_Lugar}</span>
                                </div>
                            </div>
                        </div>

                        {/* Selección de Categoría */}
                        <div className={especificacionStyle.section}>
                            <h2 className={especificacionStyle.sectionTitle}>
                                <Tag size={20} />
                                Categoría de Entrada
                            </h2>
                            <div className={especificacionStyle.categoryGrid}>
                                {['General', 'Estándar', 'Premium', 'VIP'].map((cat) => {
                                    const isSelected = categoria === cat;
                                    let precio = evento.precioTicket;
                                    let incremento = 0;
                                    
                                    switch (cat) {
                                        case 'VIP':
                                            incremento = 0.15;
                                            break;
                                        case 'Premium':
                                            incremento = 0.20;
                                            break;
                                        case 'Estándar':
                                            incremento = 0.05;
                                            break;
                                        default:
                                            incremento = 0;
                                    }
                                    
                                    const precioFinal = precio + (precio * incremento);
                                    
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            className={`${especificacionStyle.categoryCard} ${isSelected ? especificacionStyle.categoryCardSelected : ''}`}
                                            onClick={() => setCategoria(cat)}
                                        >
                                            <div className={especificacionStyle.categoryName}>{cat}</div>
                                            <div className={especificacionStyle.categoryPrice}>${precioFinal.toFixed(2)}</div>
                                            {incremento > 0 && (
                                                <div className={especificacionStyle.categoryIncrement}>+{(incremento * 100).toFixed(0)}%</div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cantidad */}
                        <div className={especificacionStyle.section}>
                            <h2 className={especificacionStyle.sectionTitle}>
                                <TicketIcon size={20} />
                                Cantidad de Entradas
                            </h2>
                            <div className={especificacionStyle.quantityControl}>
                                <button
                                    type="button"
                                    className={especificacionStyle.quantityButton}
                                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                    disabled={cantidad <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    max={ticketsDisponibles}
                                    value={cantidad}
                                    onChange={e => setCantidad(Number(e.target.value))}
                                    className={especificacionStyle.quantityInput}
                                    required
                                />
                                <button
                                    type="button"
                                    className={especificacionStyle.quantityButton}
                                    onClick={() => setCantidad(Math.min(ticketsDisponibles, cantidad + 1))}
                                    disabled={cantidad >= ticketsDisponibles}
                                >
                                    +
                                </button>
                            </div>
                            <div className={`${especificacionStyle.availabilityInfo} ${
                                ticketsDisponibles < 10 ? especificacionStyle.lowStock : 
                                ticketsDisponibles < 50 ? especificacionStyle.mediumStock : 
                                especificacionStyle.highStock
                            }`}>
                                <AlertCircle size={16} />
                                {ticketsDisponibles > 0 
                                    ? `${ticketsDisponibles} entradas disponibles` 
                                    : 'Sin entradas disponibles'}
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div className={especificacionStyle.section}>
                            <h2 className={especificacionStyle.sectionTitle}>
                                <CreditCard size={20} />
                                Método de Pago
                            </h2>
                            <div className={especificacionStyle.paymentGrid}>
                                {[
                                    { id: 'tarjetaDebito', label: 'Tarjeta de Débito', icon: '💳' },
                                    { id: 'tarjetaCredito', label: 'Tarjeta de Crédito', icon: '💳' },
                                    { id: 'transferenciaPse', label: 'Transferencia PSE', icon: '🏦' }
                                ].map(method => (
                                    <label
                                        key={method.id}
                                        className={`${especificacionStyle.paymentOption} ${
                                            metodoPago === method.id ? especificacionStyle.paymentOptionSelected : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value={method.id}
                                            checked={metodoPago === method.id}
                                            onChange={e => setMetodoPago(e.target.value)}
                                            className={especificacionStyle.paymentRadio}
                                        />
                                        <span className={especificacionStyle.paymentIcon}>{method.icon}</span>
                                        <span className={especificacionStyle.paymentLabel}>{method.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Resumen de Compra */}
                        <div className={especificacionStyle.summary}>
                            <h2 className={especificacionStyle.summaryTitle}>
                                <DollarSign size={20} />
                                Resumen de Compra
                            </h2>
                            <div className={especificacionStyle.summaryContent}>
                                <div className={especificacionStyle.summaryRow}>
                                    <span>Precio unitario ({categoria || 'Selecciona categoría'})</span>
                                    <span>${categoria ? calcularPrecioConCategoria().toFixed(2) : '0.00'}</span>
                                </div>
                                <div className={especificacionStyle.summaryRow}>
                                    <span>Cantidad</span>
                                    <span>×{cantidad}</span>
                                </div>
                                <div className={especificacionStyle.summaryDivider}></div>
                                <div className={especificacionStyle.summaryTotal}>
                                    <span>Total a Pagar</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Botón de Compra */}
                        <button
                            type="submit"
                            className={especificacionStyle.submitButton}
                            disabled={!categoria || !metodoPago || ticketsDisponibles === 0}
                        >
                            <ShoppingCart size={20} />
                            Confirmar Compra
                        </button>
                    </form>
                </div>
            </div>
            <Ticket isOpen={ticketModalOpen} onClose={() => setTicketModalOpen(false)} ticket={ticket} />
            <Footer />
        </>
    );
}

export default EspecificacionDeCompra;
