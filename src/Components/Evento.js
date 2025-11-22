import { Minimize } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function Evento({ eventoInicial, onAgregar, onModificar }) {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [tipoBoleta, setTipoBoleta] = useState('');
    const [categoria, setCategoria] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [aforo, setAforo] = useState('');
    const [lugar, setLugar] = useState('');
    const [direccion, setDireccion] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [imagen, setImagen] = useState(null);
    const [verImagen, setVerImagen] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const inputFileRef = useRef(null);
    
    const handleImagen = (e) => {
        const file = e.target.files[0]; 
        if(file){
            // Validar formato de imagen
            const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!formatosPermitidos.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Solo se permiten imágenes en formato JPG, JPEG o PNG',
                });
                e.target.value = ''; // Limpiar el input
                return;
            }
            setImagen(file);
            
            // Usar FileReader para mejor compatibilidad en producción
            const reader = new FileReader();
            reader.onloadend = () => {
                setVerImagen(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };  

    useEffect(() => {
        const token = Cookies.get('token');
        fetch("https://localhost:7047/api/Categorias", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(async response => {
            const mensaje = await response.text(); // Leer como texto, igual que en Login.js
            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: mensaje || 'No se pudieron obtener las categorías',
                });
                setCategoria([]);
            } else {
                let data = [];
                try {
                    data = JSON.parse(mensaje); // Parsear a JSON si es exitoso
                } catch (e) {
                    data = [];
                }
                setCategoria(data);
            }
            
        })
        .catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor',
            }); 
        });
    }, []);

    const handleSubmit = (e) => {
            e.preventDefault();

            // Validar que se haya seleccionado una imagen
            if (!imagen) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Debe seleccionar una imagen',
                });
                return;
            }

             const FechaHora = `${fecha}T${hora}`; // Combina fecha y hora en un solo string
            
            //Se usa formData porque en el back no acaptara el json por enciar la imagen
            const formEvento = new FormData(); 
            formEvento.append('Nombre_Evento', nombre);
            formEvento.append('Descripcion', descripcion);
            formEvento.append('Nombre_Lugar', lugar);
            formEvento.append('Direccion_Lugar', direccion);
            formEvento.append('Fecha', FechaHora);
            formEvento.append('Aforo_Max', aforo);
            formEvento.append('PrecioTicket', precio);
            formEvento.append('Categoria', categoriaSeleccionada);
            formEvento.append('Imagen', imagen); // Agregar la imagen al FormData
    
            const token = Cookies.get('token'); 
            
            fetch("https://localhost:7047/api/Eventos", {
                method: "POST",
                headers: {
                "Authorization": `Bearer ${token}`, //Token de autenticacion 
                //"Content-Type": "application/json"  no se usa porque no se envia datos en forma de JSon
                },
    
                body:formEvento // se envia el formEvento
            }).then((response) => {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Evento agregada correctamente',
                    });
                    setNombre("");
                    setPrecio("");
                    setTipoBoleta("");
                    setCategoriaSeleccionada("");
                    setAforo("");
                    setLugar("");
                    setDireccion("");
                    setFecha("");
                    setHora("");
                    setImagen(null);
                    setVerImagen("");
                    setDescripcion("");
                    // Resetear el input file
                    if (inputFileRef.current) {
                        inputFileRef.current.value = '';
                    }
                    
                    
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo agregar el evento',
                    });
                }
            });
        }
    
    return (
        <form onSubmit={handleSubmit} className='bg-gray-100 p-6  rounded-xl  w-full max-w-4xl mx-auto my-8'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>GESTIÓN EVENTO</h1>
            <div className="border-b-4 border-blue-500 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="mb-4" >

                    <label class="text-gray-700 text-sm font-bold mb-2">Nombre</label>

                    <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
                    className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="mb-4">
                    <label  class="text-gray-700 text-sm font-bold mb-2">Precio</label>
                    <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} min={1} pattern='[0-9]+' 
                    className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required/>

                </div>

                <div className="mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">Categoria</label>
                    <select value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"required>
                        <option value="">Seleccione una categoria</option>
                        {categoria.map((cat) => (
                            <option key={cat.id_Categoria} value={cat.nombre}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>
    
                <div className="mb-4">
                    <label  className="text-gray-700 text-sm font-bold mb-2">Aforo</label>
                    <input type="text" placeholder="Aforo" value={aforo} onChange={(e) => setAforo(e.target.value)} min={1} pattern='[0-9]+'
                    className=" border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
                <div className="mb-4">
                    <label className=" text-gray-700 text-sm font-bold mb-2">Lugar</label>
                    <input type="text" placeholder="Nombre del lugar" value={lugar} onChange={(e) => setLugar(e.target.value)}
                    className=" border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>

                <div className="mb-4">
                    <label className=" text-gray-700 text-sm font-bold mb-2">Direccion</label>
                    <input type="text" placeholder="Direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} maxLength={20} minLength={2}
                    className=" border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
    
                <div className="mb-4">
                    <label  className=" text-gray-700 text-sm font-bold mb-2">Fecha</label>
                    <input type="date" placeholder="Fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]}
                    className=" border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
                <div className="mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">Hora</label>
                    <input type="time" placeholder="Hora" value={hora} onChange={(e) => setHora(e.target.value)} 
                    step="60"
                    className=" border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue 500" required/>
                </div>
    
                <div className="mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">Imagen</label>
                    <label htmlFor='Imagen' className="cursor-pointer border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 block">
                        {imagen ? '✓ Imagen seleccionada' : 'Selecciona una imagen'}
                    </label>
                    <input 
                        type="file" 
                        accept=".jpg,.jpeg,.png" 
                        id='Imagen' 
                        ref={inputFileRef}
                        onChange={handleImagen} 
                        style={{ display: 'none' }}
                    />
                </div>

                {verImagen && (
                    <div className="mt-2">
                        <img src={verImagen} alt="Vista previa" className="w-32 h-32 object-cover border rounded-md" />
                    </div>
                )}
    
                <div className='mb-6 md:col-span-2'>
                    <label>Descripcion</label>
                    <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" minLength={2} maxLength={200}
                    className=" border rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
    
            </div>
            <button type="submit" className='bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 focus:outline-none transform transition-all hover:scale-105'>Aceptar</button>
        </form>
    );

}   
export default Evento;