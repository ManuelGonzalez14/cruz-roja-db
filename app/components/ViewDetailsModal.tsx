"use client";

import React, { useEffect, useRef } from 'react';

interface Props {
  voluntario: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewDetailsModal({ voluntario, isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevenir scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const iniciales = `${voluntario.nombre.charAt(0)}${voluntario.apellido.charAt(0)}`.toUpperCase();
  const nombreCompleto = `${voluntario.nombre} ${voluntario.segundoNombre ? voluntario.segundoNombre + ' ' : ''}${voluntario.apellido} ${voluntario.segundoApellido ? voluntario.segundoApellido : ''}`;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div 
        ref={modalRef}
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-color)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-color)',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--bg-color)'}
        >
          ✕
        </button>

        <div style={{ padding: '2.5rem' }}>
          
          {/* Header Profile Section */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--cruz-roja-red)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: 'bold',
              flexShrink: 0,
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}>
              {voluntario.fotoUrl ? (
                <img src={voluntario.fotoUrl} alt={voluntario.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : iniciales}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>{nombreCompleto}</h2>
                {voluntario.activo ? (
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#059669', padding: '6px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    ACTIVO
                  </span>
                ) : (
                  <span style={{ backgroundColor: 'rgba(107, 114, 128, 0.15)', color: '#4b5563', padding: '6px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    INACTIVO
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Cédula: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{voluntario.cedula}</span>
              </p>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Miembro desde: {new Date(voluntario.creadoEn).toLocaleDateString('es-PA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Grid Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            {/* Columna Izquierda: Personal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--cruz-roja-red)', borderBottom: '2px solid rgba(239, 68, 68, 0.1)', paddingBottom: '0.5rem' }}>
                👤 Información Personal
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>📅</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Fecha de Nacimiento</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {voluntario.fechaNacimiento ? new Date(voluntario.fechaNacimiento).toLocaleDateString('es-PA') : 'No especificada'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>📍</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Dirección</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {voluntario.direccion || 'No especificada'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>📱</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Teléfono Personal</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {voluntario.telefono || 'No especificado'}
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ margin: '1rem 0 0 0', color: 'var(--cruz-roja-red)', borderBottom: '2px solid rgba(239, 68, 68, 0.1)', paddingBottom: '0.5rem' }}>
                🆘 Contacto de Emergencia
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>🫂</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Nombre</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {voluntario.contactoEmergNombre || 'No especificado'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>📞</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Teléfono de Emergencia</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {voluntario.contactoEmergTelefono || 'No especificado'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Médico y Operativo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                ⚕️ Perfil Médico y Operativo
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>⭐</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Especialidad</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {voluntario.especialidad || 'Sin especialidad'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>🩸</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Tipo de Sangre</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--cruz-roja-red)', fontWeight: 'bold' }}>
                      {voluntario.tipoSangre || 'Desconocido'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>⚠️</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Alergias o Condiciones Médicas</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {voluntario.alergias || 'Ninguna registrada'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>👕</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Talla de Uniforme</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {voluntario.tallaUniforme ? `Talla ${voluntario.tallaUniforme}` : 'No especificada'}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
