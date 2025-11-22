import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import EliminarEventoStyle from '../Styles/EliminarEvento.module.css';

function EliminarEvento({ onClose, onEliminado }) {
    const [eventos, setEventos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        fetch("https://localhost:7047/api/Eventos", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setEventos(data);
            setCargando(false);
        })
        .catch(error => {
            console.error("Error al obtener eventos", error);
            setCargando(false);
        });
    }, []);

    const handleEliminar = async (id_Evento, nombre_Evento) => {
        const confirm = await Swal.fire({
            title: `¿Eliminar el evento "${nombre_Evento}"?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            const token = Cookies.get('token');
            try {
                const res = await fetch(`https://localhost:7047/api/Eventos/${id_Evento}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    Swal.fire("Eliminado", "Evento eliminado correctamente", "success");
                    setEventos(prev => prev.filter(ev => ev.id_Evento !== id_Evento));
                    //onEliminado(); // para refrescar desde el Panel 
                } else {
                    Swal.fire("Error", "No se pudo eliminar el evento");
                }
            } catch (error) {
                Swal.fire("Error", "No se pudo eliminar el evento", "error");
            }
        }
    };

    return (
        <div className={EliminarEventoStyle.modal}>
            <div className={EliminarEventoStyle.modalContenido}>
                <h2 className={EliminarEventoStyle.titulo}>Eliminar Evento</h2>
                <button className={EliminarEventoStyle.cerrar} onClick={onClose}>X</button>

                {cargando ? (
                    <p>Cargando eventos...</p>
                ) : (
                    <table className={EliminarEventoStyle.tabla}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Fecha</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.map(evento => (
                                <tr key={evento.id_Evento}>
                                    <td>{evento.id_Evento}</td>
                                    <td>{evento.nombre_Evento}</td>
                                    <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                                    <td>
                                        <button className={EliminarEventoStyle.botonEliminar} onClick={() => handleEliminar(evento.id_Evento, evento.nombre_Evento)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default EliminarEvento;
