"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { responderTicket } from '../../acciones/soporte';

export default function GestorSoporteClient({ ticketsIniciales }: { ticketsIniciales: any[] }) {
  const [tickets, setTickets] = useState(ticketsIniciales);
  const [ticketActivo, setTicketActivo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ticketActivo) return;
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const respuesta = formData.get('respuesta') as string;
    
    const result = await responderTicket(ticketActivo.id, respuesta);
    
    if (result.success) {
      toast.success("Respuesta enviada al voluntario");
      setTicketActivo(null);
      // Opcional: Recargar o actualizar estado
      window.location.reload();
    } else {
      toast.error(result.error || "Error al responder ticket");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="gestor-soporte-client">
      <div className="table-container">
        {tickets.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No hay tickets de soporte registrados aún.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Asunto</th>
                <th>Voluntario</th>
                <th>Fecha de Creación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket: any) => (
                <tr key={ticket.id}>
                  <td style={{ fontWeight: 600 }}>{ticket.asunto}</td>
                  <td>{ticket.voluntario?.nombre} {ticket.voluntario?.apellido}</td>
                  <td>{new Date(ticket.creadoEn).toLocaleDateString()}</td>
                  <td>
                    {ticket.estado === 'Abierto' ? (
                      <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '4px' }}>
                        Abierto
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '4px 8px', borderRadius: '4px' }}>
                        Resuelto
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={() => setTicketActivo(ticket)} 
                      className="btn-icon" 
                      style={{ color: 'var(--cruz-roja-red)' }} 
                      title="Ver Detalles y Responder"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {ticketActivo && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }} onClick={() => setTicketActivo(null)}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '100%', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>❓ Detalle de Ticket</h2>
              <button type="button" onClick={() => setTicketActivo(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--cruz-roja-red)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>✕</button>
            </div>
            
            <div style={{ margin: '1.5rem 0', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Enviado por:</strong> {ticketActivo.voluntario?.nombre} {ticketActivo.voluntario?.apellido}</p>
              <h3 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{ticketActivo.asunto}</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{ticketActivo.descripcion}</p>
            </div>

            {ticketActivo.estado === 'Resuelto' ? (
              <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
                <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>Respuesta de Administración</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{ticketActivo.respuesta}</p>
              </div>
            ) : (
              <form onSubmit={handleResponder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label>Escribe tu respuesta para el voluntario *</label>
                  <textarea name="respuesta" required className="search-input" rows={5} style={{ resize: 'vertical' }} placeholder="Solución o indicaciones para el voluntario..."></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="secondary-button" onClick={() => setTicketActivo(null)} disabled={isSubmitting}>Cerrar</button>
                  <button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Responder y Marcar Resuelto'}</button>
                </div>
              </form>
            )}
            
            {ticketActivo.estado === 'Resuelto' && (
              <div className="modal-footer" style={{ marginTop: '1rem' }}>
                <button type="button" className="secondary-button" onClick={() => setTicketActivo(null)}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
