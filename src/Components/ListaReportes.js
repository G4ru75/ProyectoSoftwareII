import React, { useEffect, useState } from "react";
import ListaReportesStyle from "../Styles/ListaReportes.module.css";
import Cookies from "js-cookie";

function ListaReportes({ onClose, modoSeleccion = false, onSeleccionarReporte }) {
    const [reportes, setReportes] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        fetch("https://localhost:7047/api/Reportes", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setReportes(data);
            setCargando(false);
        })
        .catch(() => {
            setCargando(false);
            setReportes([]);
        });
    }, []);

    return (
        <div className={ListaReportesStyle.contenedor}>
            <h2 className={ListaReportesStyle.titulo}>Lista de Reportes</h2>
            {cargando ? (
                <p className={ListaReportesStyle.mensaje}>Cargando reportes...</p>
            ) : reportes.length === 0 ? (
                <p className={ListaReportesStyle.mensaje}>No hay reportes disponibles.</p>
            ) : (
                <div className={ListaReportesStyle.tablaContenedor}>
                    <table className={ListaReportesStyle.tabla}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Evento</th>
                                <th>Ventas</th>
                                <th>Asistencias</th>
                                <th>Descripción</th>
                                {modoSeleccion && <th>Acción</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {reportes.map(reporte => (
                                <tr key={reporte.id_Reporte}>
                                    <td>{reporte.nombre_Reporte}</td>
                                    <td>{reporte.nombre_Evento}</td>
                                    <td>{reporte.n_Ventas}</td>
                                    <td>{reporte.n_Asistencias}</td>
                                    <td>{reporte.descripcion}</td>
                                    {modoSeleccion && (
                                        <td>
                                            <button
                                                className={ListaReportesStyle.botonEliminar}
                                                onClick={() => onSeleccionarReporte(reporte)}
                                            >
                                                Seleccionar
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <button className={ListaReportesStyle.botonCerrar} onClick={onClose}>Cerrar</button>
        </div>
    );
}

export default ListaReportes;