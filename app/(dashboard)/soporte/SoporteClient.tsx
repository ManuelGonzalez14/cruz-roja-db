"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { crearTicket } from '../../acciones/soporte';

export default function SoporteClient({ ticketsIniciales }: { ticketsIniciales: any[] }) {
  const [tickets, setTickets] = useState(ticketsIniciales);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketAbierto, setTicketAbierto] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await crearTicket(formData);
    
    if (result.success) {
      toast.success("¡Ticket enviado al equipo de soporte!");
      (e.target as HTMLFormElement).reset();
      window.location.reload();
    } else {
      toast.error(result.error || "No se pudo crear el ticket.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="soporte-layout" style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
      
      {/* Formulario de Creación */}
      <div className="soporte-form-container" style={{ flex: '1', minWidth: '350px', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Abrir un Nuevo Ticket</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Asunto / Motivo *</label>
            <input 
              type="text" 
              name="asunto"
              required 
              placeholder="Ej. Problema con horas del turno" 
              className="search-input"
              style={{ width: '100%', padding: '0.75rem' }}
            />
          </div>
          
          <div className="input-group">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Describe tu problema *</label>
            <textarea 
              name="descripcion"
              required 
              placeholder="Explica qué ocurrió..." 
              className="search-input"
              rows={6}
              style={{ width: '100%', padding: '0.75rem', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="primary-button" disabled={isSubmitting} style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            {isSubmitting ? 'Enviando...' : 'Enviar Ticket a Soporte'}
          </button>
        </form>
      </div>

      {/* Historial de Tickets */}
      <div className="soporte-history-container" style={{ flex: '1.5', minWidth: '400px' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Mis Tickets Recientes</h3>
        
        {tickets.length === 0 ? (
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: 'var(--text-tertiary)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>📝</span>
            No tienes tickets de soporte en este momento.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tickets.map((ticket: any) => (
              <div 
                key={ticket.id} 
                onClick={() => setTicketAbierto(ticket)}
                style={{ 
                  backgroundColor: 'var(--surface-color)', 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  boxShadow: 'var(--shadow-sm)',
                  borderLeft: ticket.estado === 'Resuelto' ? '4px solid #10b981' : '4px solid #ef4444',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0 }}>{ticket.asunto}</h4>
                  <span className="badge" style={{ 
                    backgroundColor: ticket.estado === 'Resuelto' ? '#d1fae5' : '#fee2e2', 
                    color: ticket.estado === 'Resuelto' ? '#047857' : '#b91c1c',
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                  }}>
                    {ticket.estado}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {ticket.descripcion}
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(ticket.creadoEn).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle de Ticket para el Voluntario */}
      {ticketAbierto && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }} onClick={() => setTicketAbierto(null)}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '100%', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>Detalles del Ticket</h2>
              <button type="button" onClick={() => setTicketAbierto(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--cruz-roja-red)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>✕</button>
            </div>
            
            <div style={{ margin: '1.5rem 0', padding: '1.25rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
              <h3 style={{ marginTop: '0', marginBottom: '1rem' }}>{ticketAbierto.asunto}</h3>
              <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ticketAbierto.descripcion}</p>
            </div>

            {ticketAbierto.estado === 'Resuelto' ? (
              <div style={{ padding: '1.25rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
                <h4 style={{ color: '#047857', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>✓</span> Respuesta del Administrador
                </h4>
                <p style={{ whiteSpace: 'pre-wrap', color: '#065f46', lineHeight: 1.6 }}>{ticketAbierto.respuesta}</p>
              </div>
            ) : (
              <div style={{ padding: '1.25rem', backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '8px' }}>
                <h4 style={{ color: '#c2410c', margin: 0 }}>⏳ Pendiente de Respuesta</h4>
                <p style={{ color: '#9a3412', marginTop: '0.5rem', fontSize: '0.9rem' }}>Un administrador está revisando tu caso. Recibirás una respuesta pronto.</p>
              </div>
            )}
            
            <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="secondary-button" onClick={() => setTicketAbierto(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
