"use client";

import React, { useState } from 'react';
import VolunteerActions from './VolunteerActions';

interface Props {
  voluntario: any;
}

export default function VolunteerCard({ voluntario }: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const iniciales = `${voluntario.nombre.charAt(0)}${voluntario.apellido.charAt(0)}`.toUpperCase();

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      className="volunteer-card"
      onClick={() => setIsDetailsOpen(true)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className={`avatar-wrapper ${voluntario.activo ? 'active' : 'inactive'}`}>
            {voluntario.fotoUrl ? (
              <img src={voluntario.fotoUrl} alt={voluntario.nombre} className="volunteer-avatar" />
            ) : (
              <div className="volunteer-avatar-fallback">{iniciales}</div>
            )}
          </div>
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>
              {voluntario.nombre} {voluntario.apellido}
            </h4>
            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '4px' }}>
              #{voluntario.numeroCarnet || voluntario.cedula}
            </p>
          </div>
        </div>
        {/* Botón de opciones */}
        <button
          style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem' }}
          onClick={(e) => e.stopPropagation()}
        >...</button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        {voluntario.activo ? (
          <span className="status-badge active">Active</span>
        ) : (
          <span className="status-badge inactive">Inactive</span>
        )}
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <VolunteerActions
            voluntario={voluntario}
            isDetailsOpen={isDetailsOpen}
            onCloseDetails={() => setIsDetailsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
