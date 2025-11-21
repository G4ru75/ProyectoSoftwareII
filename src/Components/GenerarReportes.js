import {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function GenerarReporte() {

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [evento, setEvento] = useState('');
    const [aforoMaximo, setAforoMaximo] = useState('');
    const [totalEntradasVendidas, setTotalEntradasVendidas] = useState('');
    const [totalAsistencias, setTotalAsistencias] = useState('');
    const [listaEventos, setListaEventos] = useState([]);
    
    useEffect(() => {
            fetch('https://localhost:7047/api/Eventos')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener los eventos');
                    }
                    return response.json();
                })
                .then(data => {
                    const EventosActivos = data.filter(evento => evento.estado == true)
                    setListaEventos(EventosActivos);
                    console.log(EventosActivos);
                })
                .catch(error => console.error("Error al obtener eventos:", error));
        }, []);

        useEffect(() => {
            if(evento){
                const eventoSeleccionado = listaEventos.find(ev => ev.id_Evento == evento)
                if(eventoSeleccionado){
                    setAforoMaximo(eventoSeleccionado.aforo_Max);
                }
            }else{
                setAforoMaximo('');
            }
        },[evento, listaEventos]);

    const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado un evento
    if (!evento || !aforoMaximo) {
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un evento.',
        });
        return;
    }

    // Convertimos a número por si vienen como strings
    const aforo = parseInt(aforoMaximo);
    const entradas = parseInt(totalEntradasVendidas);
    const asistencias = parseInt(totalAsistencias);

    // Validar que los valores sean números válidos
    if (isNaN(aforo) || isNaN(entradas) || isNaN(asistencias)) {
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Los valores numéricos no son válidos.',
        });
        return;
    }

    // Validar que no sean números negativos
    if (entradas < 0 || asistencias < 0) {
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Los valores no pueden ser negativos.',
        });
        return;
    }

    if (entradas > aforo) {
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las entradas vendidas no pueden ser mayores al aforo máximo.',
        });
        return;
    }else if(asistencias > entradas){
        Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las asistencias no pueden ser mayores a las entradas vendidas.',
        });
        return;
    }

    //metemos a eventoNombre el nombre del evento seleccionado usando una consulta LinQ donde busca el id y guarda el nombre 
    const eventoNombre = listaEventos.find(ev => ev.id_Evento == evento)?.nombre_Evento || '';

    const Reporte ={
        nombre_Reporte: titulo,
        nombre_Evento: eventoNombre,
        n_ventas: Number(totalEntradasVendidas),
        n_Asistencias: Number(totalAsistencias),
        descripcion: descripcion,
    }; 
    
    
    const token = Cookies.get('token');

    fetch('https://localhost:7047/api/Reportes', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(Reporte) 
    }).then(async (response) => {
        if (response.ok){
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Reporte generado correctamente',
            })

            setTitulo('');
            setDescripcion('');
            setEvento('');
            setAforoMaximo('');
            setTotalEntradasVendidas('');
            setTotalAsistencias('');

        }else if(response.status === 401){
            Swal.fire({
                icon: 'error',
                title: 'Sesión expirada',
                text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            }).then(() => {
                Cookies.remove('token');
                window.location.href = '/login';
            });
        }else{
            const msg = await response.text();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: msg || 'No se pudo generar el reporte'
            });
        }
    }).catch((error) => {
        Swal.fire({
            icon: 'error', 
            title: 'Error',
            text: 'Error al generar el reporte'
        })
    })
    
    
    }

    return (
    <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Generar reporte</h1>

        <div className="bg-gray-200 rounded-2xl p-8 shadow-md-100">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                <div className="mb-6">
                    <label htmlFor="tituloReporte" className="block text-xl font-semibold mb-2">
                    Titulo reporte
                    </label>
                    <input type="text" id="tituloReporte" className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"required
                    maxLength={100}
                    minLength={3}
                    placeholder="Ingrese el título del reporte"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="descripcion" className="block text-xl font-semibold mb-2">
                    Descripción
                    </label>
                    <textarea id="descripcion" className="w-full h-48 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"required
                    placeholder='Ingrese una descripción del reporte'
                    maxLength={500}
                    minLength={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
            </div>


            <div>
                <div className="mb-6">
                    <label htmlFor="evento" className="block text-xl font-semibold mb-2">
                    evento
                    </label>
                    <select id="evento" className="border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"required
                    value={evento}
                    onChange={(e) => setEvento(e.target.value)}
                    >
                        <option value="">Seleccione</option>
                        {listaEventos.map((ev) => (
                            <option key={ev.id_Evento} value={ev.id_Evento}>
                                {ev.nombre_Evento}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="aforoMaximo" className="block text-xl font-semibold mb-2">
                    Aforo maximo
                    </label>
                    <input type="number" id="aforoMaximo" className="border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" readOnly
                    value={aforoMaximo}
                    onChange={(e) => setAforoMaximo(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="totalEntradasVendidas" className="block text-xl font-semibold mb-2">
                    Total entradas vendidas
                    </label>
                    <input type="number" id="totalEntradasVendidas" className="border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"required
                    value={totalEntradasVendidas}
                    min={0}
                    max={aforoMaximo}
                    onChange={(e) => setTotalEntradasVendidas(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="totalAsistencias" className="block text-xl font-semibold mb-2">
                    Total asistencias
                    </label>
                    <input type="number" id="totalAsistencias" className="border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"required
                    value={totalAsistencias}
                    min={0}
                    max={totalEntradasVendidas}
                    onChange={(e) => setTotalAsistencias(e.target.value)}
                    />
                </div>
            </div>
            </div>

            <div className="flex justify-center text-3xl mt-8">
            <button type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-16 focus:outline-none transform transition-all hover:scale-105"
            >
                Generar
            </button>
            </div>
        </form>
        </div>
    </div>
    )
}

export default GenerarReporte