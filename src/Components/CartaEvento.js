import React from 'react';
import cartaEventoStyle from '../Styles/CartaEvento.module.css';
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function CartaEvento({ evento }) {
    const navigate = useNavigate();

    if (!evento) return null;

    const IrAEvento = () => {
        navigate(`/evento/${evento.id_Evento}`);
        window.scrollTo(0, 0);
    };

    const fechaFormateada = new Date(evento.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const horaFormateada = new Date(evento.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={cartaEventoStyle.tarjeta}>
            {/* Imagen */}
            <div className={cartaEventoStyle.contenedorImagen}>
                <img 
                    src={`data:image/jpeg;base64,${evento.imagen}`} 
                    alt={evento.nombre_Evento} 
                    className={cartaEventoStyle.imagen}
                />
                {/* Badge de categoría */}
                <div className={cartaEventoStyle.badge}>
                    {evento.categoria}
                </div>
                {/* Badge de tickets disponibles */}
                {evento.tickets_Disponible < 20 && (
                    <div className={cartaEventoStyle.ticketsBadge}>
                        <Ticket size={14} />
                        {evento.tickets_Disponible} disponibles
                    </div>
                )}
            </div>

            <div className={cartaEventoStyle.contenido}>
                {/* Título */}
                <h3 className={cartaEventoStyle.titulo}>{evento.nombre_Evento}</h3>

                {/* Información del evento */}
                <div className={cartaEventoStyle.infoGrid}>
                    <div className={cartaEventoStyle.infoItem}>
                        <Calendar className={cartaEventoStyle.icono} size={16} />
                        <span className={cartaEventoStyle.infoTexto}>{fechaFormateada}</span>
                    </div>

                    <div className={cartaEventoStyle.infoItem}>
                        <Clock className={cartaEventoStyle.icono} size={16} />
                        <span className={cartaEventoStyle.infoTexto}>{horaFormateada}</span>
                    </div>

                    <div className={cartaEventoStyle.infoItem}>
                        <MapPin className={cartaEventoStyle.icono} size={16} />
                        <span className={cartaEventoStyle.infoTexto}>{evento.nombre_Lugar}</span>
                    </div>
                </div>

                {/* Precio y botón */}
                <div className={cartaEventoStyle.footer}>
                    <div className={cartaEventoStyle.precio}>
                        <span className={cartaEventoStyle.precioLabel}>Desde</span>
                        <span className={cartaEventoStyle.precioValor}>${evento.precioTicket}</span>
                    </div>
                    <button className={cartaEventoStyle.boton} onClick={IrAEvento}>
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartaEvento;
