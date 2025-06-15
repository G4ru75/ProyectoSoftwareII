import NavBar from './navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';
import Ticket from './Ticket';
import Swal from 'sweetalert2';
import Loader from './Loader';

function EspecificacionDeCompra({ handleClose }) {
    const location = useLocation();
    const evento = location.state?.evento;

    const [cantidad, setCantidad] = useState(1);
    const [categoria, setCategoria] = useState(evento?.categoria || '');
    const [metodoPago, setMetodoPago] = useState('');
    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [Cargando, setCargando] = useState(false); 

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

        const token = Cookies.get('token');
        const ticketDto = {
            Precio: calcularPrecioConCategoria(),
            Nombre_Evento: evento.nombre_Evento,
            Categoria: categoria,
            Fecha_Entrada: new Date(evento.fecha).toISOString(),
            Id_Evento: evento.id_Evento
        };

        setCargando(true); 
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
        } else {
            setCargando(false);
            Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error',
                text: `No se pudo completar la compra. Por favor, inténtelo de nuevo más tarde.`,
            });
        }
    };

    if (!evento) {
        return <p className='text-center mt-10 text-red-500'>No se ha seleccionado ningún evento.</p>;
    }

    return (
        <>
            <NavBar />
            <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto my-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">COMPRAR ENTRADAS</h1>
                <div className="border-2 border-blue-500 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1">NOMBRE EVENTO</label>
                        <input
                            type="text"
                            value={evento.nombre_Evento}
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1">CATEGORIA DE ENTRADA</label>
                        <select
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categoria}
                            onChange={e => setCategoria(e.target.value)}
                            required
                        >
                            <option value="">Seleccione una categoría</option>
                            <option value="General">General</option>
                            <option value="Estándar">Estándar</option>
                            <option value="Premium">Premium</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1">PRECIO UNITARIO CON CATEGORÍA</label>
                        <input
                            type="text"
                            value={calcularPrecioConCategoria().toFixed(2)}
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1">CANTIDAD</label>
                        <input
                            type="number"
                            min={1}
                            max={evento.tickets_Disponible}
                            value={cantidad}
                            onChange={e => setCantidad(Number(e.target.value))}
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 mb-3">
                        <label className="block text-sm font-bold mb-1">TOTAL:</label>
                        <input
                            type="text"
                            value={total.toFixed(2)}
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                        />
                    </div>
                    <div className="md:col-span-2 mb-4">
                        <label className="block text-sm font-bold mb-1">SELECCIONA METODO DE PAGO</label>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input className="h-4 w-4 border-gray-300 rounded" type="radio" name="metodoPago" id="tarjetaDebito" value="tarjetaDebito" onChange={e => setMetodoPago(e.target.value)} />
                                <label className="ml-2 block text-sm text-gray-700" htmlFor="tarjetaDebito">Tarjeta de débito</label>
                            </div>
                            <div className="flex items-center">
                                <input className="h-4 w-4 border-gray-300 rounded" type="radio" name="metodoPago" id="tarjetaCredito" value="tarjetaCredito" onChange={e => setMetodoPago(e.target.value)} />
                                <label className="ml-2 block text-sm text-gray-700" htmlFor="tarjetaCredito">Tarjeta de crédito</label>
                            </div>
                            <div className="flex items-center">
                                <input className="h-4 w-4 border-gray-300 rounded" type="radio" name="metodoPago" id="transferenciaPse" value="transferenciaPse" onChange={e => setMetodoPago(e.target.value)} />
                                <label className="ml-2 block text-sm text-gray-700" htmlFor="transferenciaPse">Transferencia por PSE</label>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none transform transition-all hover:scale-105"
                    >
                        COMPRAR
                    </button>
                </div>
            </form>
            <Ticket isOpen={ticketModalOpen} onClose={() => setTicketModalOpen(false)} ticket={ticket} />
            <Footer />
        </>
    );
}

export default EspecificacionDeCompra;
