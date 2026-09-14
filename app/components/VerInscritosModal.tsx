'use client';

import React from 'react';
import { X, UserCircle2 } from 'lucide-react';

interface VerInscritosModalProps {
  isOpen: boolean;
  onClose: () => void;
  turno: any;
}

export default function VerInscritosModal({ isOpen, onClose, turno }: VerInscritosModalProps) {
  if (!isOpen || !turno) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Voluntarios Inscritos
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Turno: <strong>{turno.titulo}</strong>
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {turno.voluntariosInscritos.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Aún no hay voluntarios inscritos en este turno.</p>
              </div>
            ) : (
              turno.voluntariosInscritos.map((inscripcion: any) => (
                <div key={inscripcion.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(230,0,0,0.1)', color: 'var(--cruz-roja-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCircle2 size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>
                      {inscripcion.voluntario?.nombre} {inscripcion.voluntario?.apellido}
                    </h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                      Cédula: {inscripcion.voluntario?.cedula || 'N/A'} | Carnet: {inscripcion.voluntario?.numeroCarnet || 'N/A'}
                    </span>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34c759', display: 'inline-block' }}>
                      {inscripcion.estado}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
