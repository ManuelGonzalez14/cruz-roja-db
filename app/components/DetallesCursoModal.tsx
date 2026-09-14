import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, MapPin, User, Users, Calendar, AlertCircle } from 'lucide-react';

interface DetallesCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  curso: any;
  voluntarioId?: number;
  onSalirCurso?: (id: number) => void;
  isPending?: boolean;
}

export default function DetallesCursoModal({ isOpen, onClose, curso, voluntarioId, onSalirCurso, isPending }: DetallesCursoModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Reset confirmation state when modal opens/closes
  useEffect(() => {
    if (!isOpen) setShowConfirm(false);
  }, [isOpen]);

  if (!isOpen || !curso) return null;

  const estoyInscrito = voluntarioId && curso.inscripciones?.some((i: any) => i.voluntarioId === voluntarioId);

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--surface-color)',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '2rem 2rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--surface-color)',
          zIndex: 10,
          borderRadius: '24px 24px 0 0'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--cruz-roja-red)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.5rem' }}>
                {curso.titulo}
              </h2>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '99px', 
                backgroundColor: 'rgba(0,122,255,0.1)', 
                color: '#007aff',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                Estado del Curso: {curso.estado}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.5rem', borderRadius: '50%' }}
            className="hover-bg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Descripción */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              Descripción / Temario
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {curso.descripcion || 'No hay descripción detallada para este curso.'}
            </p>
          </div>

          {/* Detalles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} />
                Fechas y Horarios
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="var(--text-tertiary)" />
                  <span><strong>Horario:</strong> {curso.horaInicio} a {curso.horaFin}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Calendar size={16} color="var(--text-tertiary)" style={{ marginTop: '0.2rem' }} />
                  <div>
                    <strong>Días de clases:</strong>
                    {curso.diasClase && curso.diasClase.length > 0 ? (
                      <ul style={{ margin: '0.25rem 0 0 1.5rem', padding: 0 }}>
                        {curso.diasClase.map((d: any, idx: number) => (
                          <li key={idx}>{new Date(d).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ marginTop: '0.25rem' }}>Del {new Date(curso.fechaInicio).toLocaleDateString()} al {new Date(curso.fechaFin).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} />
                Organización
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--text-tertiary)" />
                  <span><strong>Ubicación:</strong> {curso.ubicacion || 'Sede Principal'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color="var(--text-tertiary)" />
                  <span><strong>Instructor:</strong> {curso.instructor || 'Por asignar'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} color="var(--text-tertiary)" />
                  <span><strong>Cupos:</strong> {curso.inscripciones?.length || 0} / {curso.cuposMaximos} inscritos</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)', borderRadius: '0 0 24px 24px' }}>
          
          {showConfirm ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <span style={{ color: 'var(--cruz-roja-red)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} /> ¿Seguro que deseas salir del curso?
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem' }}
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    onSalirCurso && onSalirCurso(curso.id);
                  }}
                  disabled={isPending}
                  style={{ background: 'var(--cruz-roja-red)', border: 'none', color: 'white', fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer', padding: '0.5rem 1rem', borderRadius: '8px', opacity: isPending ? 0.7 : 1 }}
                >
                  {isPending ? 'Saliendo...' : 'Sí, salir'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                {estoyInscrito && (
                  <button 
                    onClick={() => setShowConfirm(true)}
                    disabled={isPending}
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid var(--cruz-roja-red)', 
                      color: 'var(--cruz-roja-red)',
                      padding: '0.75rem 1.5rem', 
                      borderRadius: '12px',
                      fontWeight: 600,
                      cursor: isPending ? 'not-allowed' : 'pointer',
                      opacity: isPending ? 0.6 : 1
                    }}
                  >
                    Salir del Curso
                  </button>
                )}
              </div>

              <button 
                onClick={onClose}
                className="secondary-button"
                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}
              >
                Cerrar
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
