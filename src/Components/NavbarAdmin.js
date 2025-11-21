import react, {useState, useEffect} from 'react';
import NavbarStyle from '../Styles/NavBar.module.css';
import {Link, useNavigate} from 'react-router-dom';
import { getSecureCookie, clearSessionCookies } from '../utils/securityHelpers';

function NavbarAdmin() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [usuarioLogueado, setUsuarioLogueado] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay un token en las cookies
        const token = getSecureCookie('token');
        setUsuarioLogueado(!!token);
    }, []);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const cerrarSesion = () => {
        clearSessionCookies();
        setUsuarioLogueado(false);
        navigate('/login');
    };

    return (
        <header className={NavbarStyle.navbar}>
        <div className={NavbarStyle.logo}>
            <img src="/imagenes/LogoBoletaYa.ico" alt="Logo" className={NavbarStyle.logoImg} />
        </div>
        <h1 className={NavbarStyle.title}>Boletas ya</h1>
        <div className={NavbarStyle.hamburger} onClick={toggleMenu}>
            <span/>
            <span/>
            <span/>
        </div>

        <nav className={`${NavbarStyle.menu} ${menuAbierto ? NavbarStyle.show : ""}`}>
        <Link to="/informacion">Informacion</Link>
        <Link to="/informacion">Contacto</Link>
        {usuarioLogueado ? (
            <a onClick={cerrarSesion} style={{ cursor: 'pointer' }}>Cerrar Sesión</a>
        ) : (
            <>
                <Link to="/login">Iniciar Sesion</Link>
                <Link to="/signup">Registrarse</Link>
            </>
        )}
        </nav>
    </header>
    );
    }

export default NavbarAdmin;