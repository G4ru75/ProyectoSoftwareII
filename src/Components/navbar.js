import react, {useState} from 'react';
import NavbarStyle from '../Styles/NavBar.module.css';
import {Link, useNavigate} from 'react-router-dom';
import TicketsButton from './TicketsButton';

function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();

    const IrAInicio = () => {
        navigate('/');
    }
    const IrPaginaPrincipal = () => {
        navigate('/PaginaPrincipal');
    }
    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    return (
        <header className={NavbarStyle.navbar}>
        <div className={NavbarStyle.logo} onClick={IrPaginaPrincipal}>
            <img src="/imagenes/LogoBoletaYa.ico" alt="Logo" className={NavbarStyle.logoImg} />
        </div>
        <h1 className={NavbarStyle.title} onClick={IrAInicio}>Boletas ya</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: '40px'}}>
            <div>
            <TicketsButton />
        </div>
        <div className={NavbarStyle.hamburger} onClick={toggleMenu}>
            <span/>
            <span/>
            <span/>
        </div>
        </div>

        <nav className={`${NavbarStyle.menu} ${menuAbierto ? NavbarStyle.show : ""}`}>
        <Link to="/PaginaPrincipal">Inicio</Link>
        <Link to="/informacion">Informacion</Link>
        <Link to="/informacion">Contacto</Link>
        <Link to="/login">Iniciar Sesion</Link>
        <Link to="/signup">Registrarse</Link>
        </nav>
    </header>
    );
    }

export default Navbar;