import react, {useState, useEffect} from 'react';
import LoginStyle from '../Styles/Login.module.css';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Link, useNavigate} from 'react-router-dom';
import Loader from './Loader';
import { setSecureCookie, sanitizeInput } from '../utils/securityHelpers';

const StyleModal = {
  modal: "fixed top-0 left-0 w-screen h-screen flex items-center justify-center rounded-lg boder border-black"
}

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errores, setErrores] = useState({});
  const [Cargando, setCargando] = useState(false); 

  const CerrarModal = () => {
    setCargando(false); 
  }

  const navegar = useNavigate();

  useEffect(() => {
    const errores = {};

    if (contraseña && (contraseña.length < 8 || contraseña.length > 20)) {
        errores.contraseña = 'La contraseña debe tener entre 8 y 20 caracteres';
    }


    setErrores(errores);
  },[contraseña]); 

  const handleIniciarSesion = (e) => {
    e.preventDefault();


    if (Object.keys(errores).length === 0) {

      // Sanitizar entradas del usuario
      const usuarioSanitizado = sanitizeInput(nombreUsuario);
      
      const Usuario = {
        nombreUsuario: usuarioSanitizado,
        contrasena: contraseña // La contraseña no se sanitiza para no alterar los caracteres
      }

      if(!Usuario.nombreUsuario || Usuario.nombreUsuario.length<3 || Usuario.nombreUsuario.length>20 || !Usuario.contrasena)
        {
          Swal.fire({                        
            icon: 'error',
            title: 'Oops...',
            text: "El nombre de usuario debe tener entre 3 y 20 caracteres o verifique la contraseña",
          });
          return; 
        }


      setCargando(true); 
      fetch('https://localhost:7047/api/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //"Authorization": "Bearer " + token
        },
        body: JSON.stringify(Usuario)
      })

      .then(async response => {
        const mensaje = await response.text(); 
        setCargando(false);                   //Aqui se tiene que transformar a texto
        if (!response.ok){                    //Porque los locos del back devuelven un texto plano 
          Swal.fire({                         //el mensajito de credenciales incorrectas
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
          });

        } else {
          setCargando(false);
          let data = JSON.parse(mensaje); //Aqui se tiene que parsear a JSON porque los datos si lo mandan como JSON       

          // Usar cookies seguras
          setSecureCookie('token', data.token, { expires: 1 });
          setSecureCookie('user', JSON.stringify(data.user), { expires: 1 });
          
          setNombreUsuario('');
          setContraseña('');

          if(data.user.rol === 'Usuario'){
            Swal.fire({                     //Donde va el token y el user
            icon: 'success',
            title: 'Éxito',
            text: `Bienvenido usuario ${sanitizeInput(data.user.nombre)} ${sanitizeInput(data.user.apellido)}`,
          });
            navegar('/PaginaPrincipal'); //Ir a principal si los datos si el usuario es usuario jsndajsddfsdj
          }else if(data.user.rol === 'Admin'){
            Swal.fire({                     //Donde va el token y el user
            icon: 'success',
            title: 'Éxito',
            text: `Bienvenido admin ${sanitizeInput(data.user.nombre)} ${sanitizeInput(data.user.apellido)}`,
          });
            navegar('/paginaAdmin'); //Ir a panel de control si el usuario es admin
          }
        }
      });
  }else {
    console.log('Errores en el formulario:', errores);
  }
  }; 


  return (
    <>
    <div className={LoginStyle.container}>
      <div className={LoginStyle.loginBox}>
        <div className={LoginStyle.avatar}>
          <img src="/imagenes/LogoBoletaYa.ico" alt="Logo" className={LoginStyle.loginLogo} />
        </div>
        <h2 className={LoginStyle.title}>BIENVENIDO</h2>

        <div className="form-floating mb-3 ">
          <input type="text" className="form-control h-75 d-inline-block" id="floatingInput" placeholder="name@example.com" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)}/>
          <label for="floatingInput">Nombre Usuario</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPassword" placeholder="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
          <label for="floatingPassword">Contraseña</label>
          {errores.contraseña && <span className={LoginStyle.error}>{errores.contraseña}</span>}
        </div>
        <br/>
        <button className={LoginStyle.button} onClick={handleIniciarSesion}>Iniciar sesion</button>
        <div>
          <p className={LoginStyle.texto}>¿No tienes cuenta?</p>
          <Link to="/signup" className={LoginStyle.a}>Registrate</Link>
        </div>
      </div>
    </div>

    {Cargando && (
      <div className={StyleModal.modal}>
        <Loader/>
      </div>
      )}
    </>
    
  );
}

export default Login;

