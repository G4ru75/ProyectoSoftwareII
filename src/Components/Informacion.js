import React from 'react';
import InformacionStyles from '../Styles/Informacion.module.css';
import { ShoppingCart, Shield, Search, Headphones, Phone, Mail, Sparkles, CheckCircle2, Users, Clock } from 'lucide-react';

function Informacion() {
return (
    <>
        <div className={InformacionStyles.heroSection}>
            <div className={InformacionStyles.heroContent}>
                <Sparkles className={InformacionStyles.heroIcon} size={48} />
                <h1 className={InformacionStyles.heroTitle}>Sobre BoletaYa</h1>
                <p className={InformacionStyles.heroSubtitle}>
                    Tu plataforma de confianza para adquirir boletas de los mejores eventos
                </p>
            </div>
        </div>

        <main className={InformacionStyles.infoMain}>
            {/* Sección de descripción */}
            <section className={InformacionStyles.descriptionSection}>
                <div className={InformacionStyles.descriptionCard}>
                    <h2 className={InformacionStyles.sectionTitle}>¿Quiénes Somos?</h2>
                    <p className={InformacionStyles.descriptionText}>
                        En <strong>BoletaYa</strong> te ofrecemos una experiencia ágil, segura y sin complicaciones 
                        para adquirir tus entradas a los mejores eventos. Ya sea que busques asistir a conciertos, 
                        obras de teatro, festivales, conferencias o eventos deportivos, aquí encontrarás las boletas 
                        más populares y demandadas del momento.
                    </p>
                </div>
            </section>

            {/* Características principales */}
            <section className={InformacionStyles.featuresSection}>
                <h2 className={InformacionStyles.sectionTitle}>Por Qué Elegirnos</h2>
                <div className={InformacionStyles.featuresGrid}>
                    <div className={InformacionStyles.featureCard}>
                        <div className={InformacionStyles.featureIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <ShoppingCart size={28} color="white" />
                        </div>
                        <h3 className={InformacionStyles.featureTitle}>Compra Rápida</h3>
                        <p className={InformacionStyles.featureText}>
                            Realiza tu compra desde la comodidad de tu casa, sin esperas ni trámites innecesarios. 
                            Proceso simplificado en pocos clics.
                        </p>
                    </div>

                    <div className={InformacionStyles.featureCard}>
                        <div className={InformacionStyles.featureIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <Shield size={28} color="white" />
                        </div>
                        <h3 className={InformacionStyles.featureTitle}>Máxima Seguridad</h3>
                        <p className={InformacionStyles.featureText}>
                            Tus datos están protegidos con altos estándares de seguridad. Transacciones encriptadas 
                            y sistema confiable.
                        </p>
                    </div>

                    <div className={InformacionStyles.featureCard}>
                        <div className={InformacionStyles.featureIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <Search size={28} color="white" />
                        </div>
                        <h3 className={InformacionStyles.featureTitle}>Búsqueda Inteligente</h3>
                        <p className={InformacionStyles.featureText}>
                            Filtra eventos por fecha, categoría o busca por nombre. Encuentra fácilmente 
                            lo que estás buscando.
                        </p>
                    </div>

                    <div className={InformacionStyles.featureCard}>
                        <div className={InformacionStyles.featureIcon} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                            <Headphones size={28} color="white" />
                        </div>
                        <h3 className={InformacionStyles.featureTitle}>Soporte 24/7</h3>
                        <p className={InformacionStyles.featureText}>
                            Nuestro equipo está disponible para ayudarte con cualquier duda o inconveniente 
                            antes, durante o después de tu compra.
                        </p>
                    </div>
                </div>
            </section>

            {/* Estadísticas */}
            <section className={InformacionStyles.statsSection}>
                <div className={InformacionStyles.statsGrid}>
                    <div className={InformacionStyles.statCard}>
                        <Users size={32} className={InformacionStyles.statIcon} />
                        <div className={InformacionStyles.statNumber}>10,000+</div>
                        <div className={InformacionStyles.statLabel}>Clientes Satisfechos</div>
                    </div>
                    <div className={InformacionStyles.statCard}>
                        <CheckCircle2 size={32} className={InformacionStyles.statIcon} />
                        <div className={InformacionStyles.statNumber}>50,000+</div>
                        <div className={InformacionStyles.statLabel}>Boletas Vendidas</div>
                    </div>
                    <div className={InformacionStyles.statCard}>
                        <Clock size={32} className={InformacionStyles.statIcon} />
                        <div className={InformacionStyles.statNumber}>24/7</div>
                        <div className={InformacionStyles.statLabel}>Disponibilidad</div>
                    </div>
                </div>
            </section>

            {/* Sección de contacto */}
            <section className={InformacionStyles.contactSection}>
                <div className={InformacionStyles.contactCard}>
                    <h2 className={InformacionStyles.sectionTitle}>Contáctanos</h2>
                    <p className={InformacionStyles.contactIntro}>
                        ¿Tienes preguntas? Estamos aquí para ayudarte. Comunícate con nosotros a través de:
                    </p>
                    <div className={InformacionStyles.contactInfo}>
                        <div className={InformacionStyles.contactItem}>
                            <div className={InformacionStyles.contactIconWrapper}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <div className={InformacionStyles.contactLabel}>Teléfono</div>
                                <div className={InformacionStyles.contactValue}>+37 333 3333 333</div>
                            </div>
                        </div>
                        <div className={InformacionStyles.contactItem}>
                            <div className={InformacionStyles.contactIconWrapper}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <div className={InformacionStyles.contactLabel}>Correo Electrónico</div>
                                <div className={InformacionStyles.contactValue}>proyectoBoletas@gmail.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA final */}
            <section className={InformacionStyles.ctaSection}>
                <div className={InformacionStyles.ctaContent}>
                    <h2 className={InformacionStyles.ctaTitle}>¡Tu próximo evento inolvidable está a solo unos clics de distancia!</h2>
                    <p className={InformacionStyles.ctaText}>Explora nuestra selección de eventos y asegura tu lugar hoy mismo</p>
                </div>
            </section>
        </main>
    </>
);
}

export default Informacion;
