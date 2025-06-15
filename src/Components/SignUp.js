import react, {useState, useEffect} from 'react';
import SignUpStyle from '../Styles/SignUp.module.css';
import Navbar from './navbar';
import Footer from './Footer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'bootstrap/dist/js/bootstrap.bundle.min';
import Loader from './Loader';


function Signup() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errores, setErrores] = useState({});
  const [Cargando, setCargando] = useState(false); // Estado para controlar el cargando

  const navegar = useNavigate();
  useEffect(() => {
    const errores = {};
    
    if (nombre && !/^[A-Za-z]+$/.test(nombre)) {
        errores.nombre = 'Verifique el nombre por favor';
    }

    if (apellido && !/^[A-Za-z]+$/.test(apellido)) {
        errores.apellido = 'Verifique el apellido por favor';
    }
    
    if (telefono && (telefono.length < 10 || telefono.length > 10)) {
        errores.telefono = 'El teléfono debe tener 10 dígitos y empezar con 3';
    }

    if (nombreUsuario.length > 20) {
        errores.nombreUsuario = 'Maximo 20 caracteres'; 
    }
      

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errores.email = 'El email no es válido';
    }

    if (contraseña && (contraseña.length < 8 || contraseña.length > 20)) {
        errores.contraseña = 'La contraseña debe tener entre 8 y 20 caracteres';
    }

    setErrores(errores);
  },[nombre, apellido, telefono, nombreUsuario, email, contraseña]);  


const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errores).length === 0) {
      setCargando(true); // Activar el cargando

        const Usuario = {
          nombre: nombre,
          apellido: apellido,
          telefono: telefono,
          nombreUsuario: nombreUsuario,
          passwordHash: contraseña,
          correo: email
        }

        fetch('https://localhost:7047/api/Login/Register', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Usuario)

            }).then(async response => {
              setCargando(false); 
          const mensaje = await response.text(); // como desde la Api mandan el mensaje en texto plano
          if (!response.ok) {                   // entonces esa linea lo cambia a tect en el front
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: mensaje, //Mensaje de error que el usuario ya existe, viene desde el backend
            });
          }else {
            Swal.fire({
            title: mensaje,
            icon: "success", //Mensaje de registro exitoso
            draggable: true
          });
          
          

          setApellido('');
          setNombre('');
          setTelefono('');
          setNombreUsuario(''); //Se limpian los campos de los inputs pe causa
          setEmail('');
          setContraseña('');
          
          navegar('/login'); //Ir a login si los datos son correctos
          }
})
    
    } else {
      console.log('Errores en el formulario:', errores);
    }
  };


  return (
    <>
      <div className={SignUpStyle.container}>
        <div className={SignUpStyle.formSection}>
          <h2>Registro de usuario</h2>
          <form className={SignUpStyle.form} onSubmit={handleSubmit}>
            <label>Nombre</label>
            <input type="text" 
            placeholder='Digite su nombre'
            maxLength={20}
            minLength={3}
            pattern="[A-Za-z ]+"
            title="El nombre solo puede contener letras"
            required
            value={nombre}
            onChange={(e => setNombre(e.target.value))}
            />
            {errores.nombre && <span className={SignUpStyle.error}>{errores.nombre}</span>}

            <label>Apellido</label>
            <input type="text" 
            placeholder='Digite su apellido'
            maxLength={20}
            minLength={3}
            pattern="[A-Za-z ]+"
            title="El nombre solo puede contener letras"
            required
            value={apellido}
            onChange={(e => setApellido(e.target.value))}
            />
            {errores.apellido && <span className={SignUpStyle.error}>{errores.apellido}</span>}

            <label>Teléfono</label>
            <input type="number"
            placeholder='Digite su numero de telefono' 
            min={3000000000}
            maxLength={10}
            minLength={10}
            pattern='[0-9]+'
            required
            value={telefono}
            onChange={(e => setTelefono(e.target.value))}
            />
            {errores.telefono && <span className={SignUpStyle.error}>{errores.telefono}</span>}

            <label>Nombre de usuario</label>
            <input type="text" 
            placeholder='Digite su nombre de usuario'
            maxLength={20}
            minLength={3}
            pattern='(?=.*[A-Za-z ])(?=.*\d)[A-Za-z\d ]{6,}+'
            required
            value={nombreUsuario}
            onChange={(e => setNombreUsuario(e.target.value))}
            />
            {errores.nombreUsuario && <span className={SignUpStyle.error}>{errores.nombreUsuario}</span>}

            <label>Email</label>
            <input type="email" 
            placeholder='Digite su email'
            pattern='[^\s@]+@[^\s@]+\.[^\s@]+'
            title="El email debe tener un formato válido"
            required
            value={email}
            onChange={(e => setEmail(e.target.value))}
            />
            {errores.email && <span className={SignUpStyle.error}>{errores.email}</span>}

            <label>Contraseña</label>
            <input type="password" 
            placeholder='Digite su contraseña'
            minLength={6}
            maxLength={20}
            required
            value={contraseña}
            pattern='(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}+'
            title="La contraseña debe tener al menos 6 caracteres y contener letras y números"
            onChange={(e => setContraseña(e.target.value))}
            />
            {errores.contraseña && <span className={SignUpStyle.error}>{errores.contraseña}</span>}

            <button type="submit">Registrarme</button>
          </form>
        </div>
        <div className={SignUpStyle.textSection}>
          <h2>Obtén tus boletas de forma rápida y segura para los eventos que amas: 
              desde los conciertos más esperados hasta los partidos más intensos y los shows más espectaculares.</h2>        
        </div>
    </div>
    </>
  );
}

export default Signup;