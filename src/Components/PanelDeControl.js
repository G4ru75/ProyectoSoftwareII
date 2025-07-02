import React, {useState} from "react";
import PanelDeControlStyles from "../Styles/PanelDeControl.module.css";
import NavbarAdmin from "./NavbarAdmin";
import Footer from "./Footer";
import Evento from "./Evento";
import EditarEvento from "./EditarEvento";
import EliminarEvento from "./EliminarEvento";
import AgregarCategoria from "./AgregarCategoria";
import ListaCategorias from "./ListaCategoria";
import EditarCategoria from "./EditarCategoria";
import ListaEventosAdmin from "./ListaEventosAdmin";
import {List, X} from "lucide-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import GenerarReporte from "./GenerarReportes";
import ListaReportes from "./ListaReportes";


const STYLES = {

    centrarContenedor: "min-h-screen bg-slate-100 py-12 px-4",
    contenedor: "max-w-7xl mx-auto",


    titulo: "text-center mb-12 text-4xl font-bold text-slate-800",

    seccion:
        "bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border mb-6",
    subtituloSeccion: "text-center mb-6 text-2xl font-bold text-slate-800",
    descripcionSeccion: "text-center mb-6 text-sm text-slate-600",
    botonesContenedor: "grid grid-cols-2 md:grid-cols-4 gap-3",

    modal: "fixed top-0 left-0 w-screen h-screen flex items-center justify-center rounded-lg boder border-black",
    modalContenido: "bg-white p-8 max-w-4xl relative overflow-y-auto max-h-[90vh]",
    cerrarModal:"absolute top-2 right-4 text-2xl cursor-pointer text-slate-600 hover:text-slate-800 transition-colors",
    }

    const BOTONES = {
    agregar: `px-4 py-3 font-semibold cursor-pointer transition-all duration-200 text-white transform hover:scale-105 bg-emerald-500 hover:bg-emerald-600`,
    consultar: `px-4 py-3 font-semibold cursor-pointer transition-all duration-200 text-white transform hover:scale-105 bg-blue-500 hover:bg-blue-600`,
    modificar: `px-4 py-3 font-semibold cursor-pointer transition-all duration-200 text-white transform hover:scale-105 bg-amber-500 hover:bg-amber-600`,
    eliminar: `px-4 py-3 font-semibold cursor-pointer transition-all duration-200 text-white transform hover:scale-105 bg-red-500 hover:bg-red-600`,
}

function PanelDeControl() {

    //Estados para eventos
    const [mostrarAgregarEvento, setMostrarAgregarEvento] = useState(false);
    const [mostrarListaEventos, setMostrarListaEventos] = useState(false);
    const [mostrarEliminarEvento, setMostrarEliminarEvento] = useState(false);
    const [mostrarEditarEvento, setMostrarEditarEvento] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    
    // Estados para categorias
    const [mostrarAgregarCategoria, setMostrarAgregarCategoria] = useState(false);
    const [mostrarListaCategorias, setMostrarListaCategorias] = useState(false);
    const [mostrarSeleccionarCategoria, setMostrarSeleccionarCategoria] = useState(false);
    const [modoSeleccionCategoria, setModoSeleccionCategoria] = useState(""); // "modificar" o "eliminar"
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);


    // Estados para reportes
    const [mostrarListaReportes, setMostrarListaReportes] = useState(false);
    const [mostrarEliminarReporte, setMostrarEliminarReporte] = useState(false);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);

    // Funciones para eventos
    const handleMostrarAgregarEvento = () =>{
        setMostrarAgregarEvento(true);
    }; 

    const handleCerrarAgregarEvento = () => {
        setMostrarAgregarEvento(false);
    }; 

    const handleAgregarEvento = () => {
        handleCerrarAgregarEvento();
    };

    const handleSeleccionarEvento = () => {
        setMostrarEditarEvento(true);
    }

    const handleSeleccionarEventoModificar = (evento) => {
        setEventoSeleccionado(evento);
        setMostrarEditarEvento(false); // Cierra la lista
    };

    const handleCerrarEditarEvento = () => {
        setEventoSeleccionado(null);
    }

    
    //  Funciones para Categorias
    const handleMostrarAgregarCategorias = () =>{
        setMostrarAgregarCategoria(true);
    }; 

    const handleCerrarAgregarCategorias = () => {
        setMostrarAgregarCategoria(false);
    }; 

    const handleAgregarCategorias = () => {
        handleCerrarAgregarCategorias();
    }; 

    const handleMostrarListaCategorias = () => {
        setMostrarListaCategorias(true);
    }

    const handleCerrarListaCategorias = () => {
        setMostrarListaCategorias(false);
    }

    const handleModificarCategoria = () => {
        setModoSeleccionCategoria("modificar");
        setMostrarSeleccionarCategoria(true);
    };

    const handleEliminarCategoria = () => {
        setModoSeleccionCategoria("eliminar");
        setMostrarSeleccionarCategoria(true);
    };

    // Cuando seleccionas una categoría de la lista
    const handleSeleccionarCategoria = (cat) => {
        setCategoriaSeleccionada(cat);
        setMostrarSeleccionarCategoria(false);
        setTimeout(() => { setCategoriaSeleccionada(cat); }, 500); // Espera para que se actualice la categoría seleccionada
    };

    // Cuando se termina de editar o eliminar
    const handleCerrarEdicion = () => {
        setCategoriaSeleccionada(null);
        setModoSeleccionCategoria("");
        setMostrarListaCategorias(false);
        setTimeout(() => setMostrarListaCategorias(true), 500); // Refresca la lista
    };

    // Eliminar categoría
    const handleConfirmarEliminar = async () => {
        if (!categoriaSeleccionada) return;
        const token = Cookies.get('token');
        try {
            const response = await fetch(`https://localhost:7047/api/Categorias/${categoriaSeleccionada.id_Categoria}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                Swal.fire('Eliminada', 'Categoría eliminada correctamente', 'success');
                handleCerrarEdicion();
            } else {
                Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
        }
    };

     // Funciones para reporte
    const handleMostrarGenerarReporte = () => {
        setMostrarGenerarReporte(true);
    }

    const handleCerrarGenerarReporte = () => {
        setMostrarGenerarReporte(false);
    }

    const handleMostrarEliminarReporte = () =>{
        setMostrarEliminarReporte(true);
        setReporteSeleccionado(null);
    }

    const handleSeleccionarReporteEliminar =  (reporte) => {
        setReporteSeleccionado(reporte);
    }

    const handleConfirmarEliminarReporte = async () => {
        if (!reporteSeleccionado) return;
        const token = Cookies.get('token');
        try {
            const response = await fetch(`https://localhost:7047/api/Reportes/${reporteSeleccionado.id_Reporte}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                Swal.fire('Eliminado', 'El reporte fue eliminado.', 'success');
                setReporteSeleccionado(null);
                setMostrarEliminarReporte(false);
            } else {
                Swal.fire('Error', 'No se pudo eliminar el reporte', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el reporte', 'error');
        }
    };

    return (
        <>
        <NavbarAdmin />

        <div className={STYLES.centrarContenedor}>
        <div className={STYLES.contenedor}>
        <h1 className={STYLES.titulo}>Panel de control</h1>

        <section className={STYLES.seccion}>
            <h2 className={STYLES.subtituloSeccion}>Eventos</h2>
            <p className={STYLES.descripcionSeccion}>Gestiona todos los eventos del sistema</p>
            <div className={STYLES.botonesContenedor}>
            <button className={BOTONES.agregar} onClick={handleMostrarAgregarEvento}>Agregar</button>
            <button className={BOTONES.consultar} onClick={() => setMostrarListaEventos(true)}>Consultar</button>
            <button className={BOTONES.modificar} onClick={handleSeleccionarEvento}>Modificar</button>
            <button className={BOTONES.eliminar}  onClick={()=> setMostrarEliminarEvento(true)}>Eliminar</button>
            </div>
        </section>

        <section className={STYLES.seccion}>
            <h2 className={STYLES.subtituloSeccion}>Categorías</h2>
            <p className={STYLES.descripcionSeccion}>Administra las categorías de eventos</p>
            <div className={STYLES.botonesContenedor}>
            <button className={BOTONES.agregar} onClick={handleMostrarAgregarCategorias}>Agregar</button>
            <button className={BOTONES.consultar} onClick={handleMostrarListaCategorias}>Consultar</button>
            <button className={BOTONES.modificar} onClick={handleModificarCategoria}>Modificar</button>
            <button className={BOTONES.eliminar} onClick={handleEliminarCategoria}>Eliminar</button>
            </div>

        </section>

        <section className={STYLES.seccion}>
            <h2 className={STYLES.subtituloSeccion}>Reportes</h2>
            <p className={STYLES.descripcionSeccion}>Genera reportes de los eventos</p>
            <div className={STYLES.botonesContenedor}>
            <button className={BOTONES.agregar} onClick={handleMostrarGenerarReporte}>Agregar</button>
            <button className={BOTONES.consultar} onClick={() => setMostrarListaReportes(true)}>Consultar</button>
            <button className={BOTONES.modificar}>Modificar</button>
            <button className={BOTONES.eliminar} onClick={handleMostrarEliminarReporte}>Eliminar</button>

            </div>
        </section>
        </div>
    </div>
    <Footer />

    {/*modales para eventos*/}
    {mostrarAgregarEvento && (
            <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
                <button onClick={handleCerrarAgregarEvento} className={STYLES.cerrarModal}><X size={30} /></button>
                <Evento onAgregar={handleAgregarEvento} />
            </div>
            </div>
    )}


    {mostrarListaEventos && (
        <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
            <button onClick={() => setMostrarListaEventos(false)} className={STYLES.cerrarModal}><X size={30} /></button>
            <ListaEventosAdmin onClose={() => setMostrarListaEventos(false)} />
            </div>
        </div>
    )}

    {mostrarEditarEvento && (
        <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
                <button onClick={() => setMostrarEditarEvento(false)} className={STYLES.cerrarModal}><X size={30} /></button>
                <ListaEventosAdmin 
                    modoSeleccion 
                    onSeleccionarEvento={handleSeleccionarEventoModificar}
                    onClose={() => setMostrarEditarEvento(false)}
                />
            </div>
        </div>
    )}

    {eventoSeleccionado && (
        <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
                <button onClick={handleCerrarEditarEvento} className={STYLES.cerrarModal}><X size={30} /></button>
                <EditarEvento
                    evento={eventoSeleccionado}
                    onClose={handleCerrarEditarEvento}
                    onActualizado={handleCerrarEditarEvento}
                />
            </div>
        </div>
    )}



    {mostrarEliminarEvento && (
        <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
            <button onClick={() => setMostrarEliminarEvento(false)} className={STYLES.cerrarModal}><X size={30} /></button>
            <EliminarEvento onClose={() => setMostrarEliminarEvento(false)} />
            </div>
        </div>
    )}

    {/* Modales para categorias*/}
    {mostrarAgregarCategoria && (
            <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
                <button onClick={handleCerrarAgregarCategorias} className={STYLES.cerrarModal}><X size={30} /></button>
                <AgregarCategoria onAgregar={handleAgregarCategorias} />
            </div>
            </div>
    )}

    {mostrarListaCategorias && (
            <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
                <button onClick={() => setMostrarListaCategorias(false)} className={STYLES.cerrarModal}><X size={30} /></button>
                <ListaCategorias onClose={() => setMostrarListaCategorias(false)} />
            </div>
            </div>
    )}

    {mostrarSeleccionarCategoria && (
            <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
                <button onClick={() => setMostrarSeleccionarCategoria(false)} className={STYLES.cerrarModal}><X size={30} /></button>
                <ListaCategorias
                modoSeleccion
                onSeleccionarCategoria={handleSeleccionarCategoria}
                onClose={() => setMostrarSeleccionarCategoria(false)}
                />
            </div>
            </div>
    )}

    {categoriaSeleccionada && modoSeleccionCategoria === "modificar" && (
            <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
                <button onClick={handleCerrarEdicion} className={STYLES.cerrarModal}><X size={30} /></button>
                <EditarCategoria
                categoria={categoriaSeleccionada}
                onClose={handleCerrarEdicion}
                onActualizada={handleCerrarEdicion}
                />
            </div>
            </div>
    )}

    {categoriaSeleccionada && modoSeleccionCategoria === "eliminar" && (
            <div className={STYLES.modal}>
            <div className={STYLES.modalContenido}>
                <button onClick={handleCerrarEdicion} className={STYLES.cerrarModal}><X size={30} /></button>
                <div className="text-center p-6">
                <p className="text-lg mb-6 text-slate-700">¿Seguro que deseas eliminar la categoría <b>{categoriaSeleccionada.nombre}</b>?</p>
                <div className="flex gap-4 justify-center">
                    <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md"onClick={handleConfirmarEliminar}>Eliminar</button>
                    <button className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors shadow-md" onClick={handleCerrarEdicion}>Cancelar</button>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* MODALES PARA REPORTE */}
        {mostrarGenerarReporte && (
                <div className={PanelDeControlStyles.modal}>
                    <div className={PanelDeControlStyles.modalContenido}>
                        <button onClick={handleCerrarGenerarReporte} className={PanelDeControlStyles.cerrarModal}><X size={30} /></button>
                        <GenerarReporte onClose={handleCerrarGenerarReporte} />
                    </div>
                </div>
            )}

        {mostrarListaReportes && (
            <div className={STYLES.modal}>
                <div className={STYLES.modalContenido}>
                    <ListaReportes onClose={() => setMostrarListaReportes(false)} />
                </div>
            </div>
        )}

        {mostrarEliminarReporte && (
            <div className={STYLES.modal}>
                <div className={STYLES.modalContenido}>
                    <button onClick={() => { setMostrarEliminarReporte(false); setReporteSeleccionado(null); }} className={STYLES.cerrarModal}><X size={30} /></button>
                    {!reporteSeleccionado ? (
                        <ListaReportes
                            onClose={() => setMostrarEliminarReporte(false)}
                            modoSeleccion={true}
                            onSeleccionarReporte={handleSeleccionarReporteEliminar}
                        />
                    ) : (
                        <div className="text-center p-6">
                            <p className="text-lg mb-6 text-slate-700">
                                ¿Seguro que deseas eliminar el reporte <b>{reporteSeleccionado.nombre_Reporte}</b>?
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md"
                                    onClick={handleConfirmarEliminarReporte}
                                >
                                    Eliminar
                                </button>
                                <button
                                    className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors shadow-md"
                                    onClick={() => setReporteSeleccionado(null)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
        </>
    )
}

export default PanelDeControl;