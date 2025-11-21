import react from 'react';
import FooterStyle from '../Styles/Footer.module.css';
import { Mail, Phone, MapPin } from 'lucide-react';

function Footer(){
    return(
    <footer className={FooterStyle.footer}>
        <div className={FooterStyle.container}>
            {/* Sección principal */}
            <div className={FooterStyle.mainSection}>
                <div className={FooterStyle.brandColumn}>
                    <h2 className={FooterStyle.brandName}>Boletas Ya</h2>
                    <p className={FooterStyle.brandTagline}>Tu plataforma de eventos favorita</p>
                </div>
                
                <div className={FooterStyle.linksColumn}>
                    <h3 className={FooterStyle.columnTitle}>Navegación</h3>
                    <a href="/PaginaPrincipal" className={FooterStyle.link}>Inicio</a>
                    <a href="/informacion" className={FooterStyle.link}>Información</a>
                    <a href="/login" className={FooterStyle.link}>Iniciar sesión</a>
                </div>
                
                <div className={FooterStyle.contactColumn}>
                    <h3 className={FooterStyle.columnTitle}>Contacto</h3>
                    <div className={FooterStyle.contactItem}>
                        <Phone size={16} />
                        <span>+57 333 3333 333</span>
                    </div>
                    <div className={FooterStyle.contactItem}>
                        <Mail size={16} />
                        <span>proyectoBoletas@gmail.com</span>
                    </div>
                    <div className={FooterStyle.contactItem}>
                        <MapPin size={16} />
                        <span>Colombia</span>
                    </div>
                </div>
            </div>
            
            {/* Línea divisora */}
            <div className={FooterStyle.divider}></div>
            
            {/* Copyright */}
            <div className={FooterStyle.copyright}>
                <p>© {new Date().getFullYear()} Boletas Ya. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
    );
}

export default Footer;

