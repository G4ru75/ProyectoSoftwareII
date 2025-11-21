import React from 'react';
import styles from '../Styles/Ticket.module.css';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

function Ticket({ isOpen, onClose, ticket }) {
    if (!isOpen || !ticket) return null;

    // Si el QR viene como base64 string:
    const qrSrc = ticket.codigoQR
        ? `data:image/png;base64,${ticket.codigoQR}`
        : null;

    const descargarPDF = () => {
        const doc = new jsPDF();
        
        // Configurar fuente y título
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Boletas YA', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text('Ticket de Entrada', 105, 30, { align: 'center' });
        
        // Línea decorativa
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        
        // Información del ticket
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Evento:', 20, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(ticket.nombre_Evento || 'N/A', 50, 50);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Categoría:', 20, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(ticket.categoria || 'N/A', 50, 60);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha:', 20, 70);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(ticket.fecha_Entrada).toLocaleString(), 50, 70);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Código:', 20, 80);
        doc.setFont('helvetica', 'normal');
        doc.text(ticket.codigoAlfanumerico || 'N/A', 50, 80);
        
        // Solo mostrar precio si existe
        if (ticket.precio !== undefined && ticket.precio !== null) {
            doc.setFont('helvetica', 'bold');
            doc.text('Precio:', 20, 90);
            doc.setFont('helvetica', 'normal');
            doc.text(`$${ticket.precio.toFixed(2)}`, 50, 90);
        }
        
        // Agregar código QR si existe
        if (qrSrc) {
            doc.setFont('helvetica', 'bold');
            doc.text('Código QR:', 20, 105);
            doc.addImage(qrSrc, 'PNG', 60, 110, 80, 80);
            
            // Instrucciones
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text('Presenta este código QR en la entrada del evento', 105, 200, { align: 'center' });
        }
        
        // Footer
        doc.setLineWidth(0.5);
        doc.line(20, 270, 190, 270);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Boletas YA - Tu plataforma de eventos', 105, 280, { align: 'center' });
        doc.text(`Generado el ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
        
        // Guardar PDF
        doc.save(`ticket-${ticket.codigoAlfanumerico || 'boleta'}.pdf`);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div 
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '450px',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    padding: '0'
                }}
            >
                {/* Header */}
                <div style={{
                    background: '#3b82f6',
                    padding: '20px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    borderRadius: '1rem 1rem 0 0'
                }}>
                    <button 
                        onClick={onClose} 
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        &times;
                    </button>
                    
                    <h2 style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '600',
                        textAlign: 'center',
                        margin: 0
                    }}>
                        Ticket de Entrada
                    </h2>
                </div>

                {/* Contenido con padding */}
                <div style={{ padding: '24px' }}>
                    {/* Nombre del evento destacado */}
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '20px',
                        textAlign: 'center',
                        lineHeight: '1.3'
                    }}>
                        {ticket.nombre_Evento}
                    </h3>
                    
                    {/* Información en lista simple */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            padding: '12px 0',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Fecha</span>
                            <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: '500', textAlign: 'right' }}>
                                {new Date(ticket.fecha_Entrada).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        
                        <div style={{
                            padding: '12px 0',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Categoría</span>
                            <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>
                                {ticket.categoria}
                            </span>
                        </div>
                        
                        <div style={{
                            padding: '12px 0',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>Código</span>
                            <span style={{
                                color: '#1e293b',
                                fontSize: '13px',
                                fontWeight: '600',
                                fontFamily: 'monospace',
                                backgroundColor: '#f1f5f9',
                                padding: '4px 8px',
                                borderRadius: '4px'
                            }}>
                                {ticket.codigoAlfanumerico}
                            </span>
                        </div>
                        
                        {ticket.precio !== undefined && ticket.precio !== null && (
                            <div style={{
                                padding: '12px 0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Precio</span>
                                <span style={{
                                    color: '#3b82f6',
                                    fontSize: '16px',
                                    fontWeight: '700'
                                }}>
                                    ${ticket.precio.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Código QR */}
                    {qrSrc && (
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            paddingTop: '16px',
                            borderTop: '1px solid #e2e8f0'
                        }}>
                            <p style={{
                                color: '#64748b',
                                fontSize: '13px',
                                marginBottom: '12px'
                            }}>
                                Escanea este código en la entrada
                            </p>
                            <div style={{
                                display: 'inline-block',
                                padding: '12px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px'
                            }}>
                                <img src={qrSrc} alt="QR" width={160} height={160} />
                            </div>
                        </div>
                    )}
                    
                    {/* Botón de descarga */}
                    <button 
                        onClick={descargarPDF}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                        <Download size={18} />
                        Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Ticket;