"use client";

import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { agregarCurso, eliminarCurso, obtenerCursos } from '../acciones/cursos';
import CustomSelect from './CustomSelect';

const opcionesCursos = [
  { value: "Primeros Auxilios Básicos (PAB)", label: "Primeros Auxilios Básicos (PAB)" },
  { value: "Técnico en Urgencias Médicas (TUM)", label: "Técnico en Urgencias Médicas (TUM)" },
  { value: "Asistente de Primeros Auxilios (APA)", label: "Asistente de Primeros Auxilios (APA)" },
  { value: "RCP y Uso de DEA", label: "RCP y Uso de DEA" },
  { value: "Apoyo Psicosocial (APS)", label: "Apoyo Psicosocial (APS)" },
  { value: "Manejo de Incidentes (SCI)", label: "Manejo de Incidentes (SCI)" },
  { value: "Conducción de Vehículos de Emergencia (COVE)", label: "Conducción de Vehículos de Emergencia (COVE)" },
  { value: "Otro", label: "Otro (Especificar...)" }
];

interface GestorCursosModalProps {
  isOpen: boolean;
  onClose: () => void;
  voluntario: any;
}

export default function GestorCursosModal({ isOpen, onClose, voluntario }: GestorCursosModalProps) {
  const [cursos, setCursos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isCustomCurso, setIsCustomCurso] = useState(false);

  const cargarCursos = async () => {
    if (!voluntario) return;
    setIsLoading(true);
    const result = await obtenerCursos(voluntario.id);
    if (result.success && result.cursos) {
      setCursos(result.cursos);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      cargarCursos();
    } else {
      document.body.style.overflow = '';
      setCursos([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, voluntario]);

  if (!isOpen || !voluntario) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('voluntarioId', voluntario.id.toString());

    const result = await agregarCurso(formData);
    
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Curso agregado exitosamente');
      (e.target as HTMLFormElement).reset(); // Limpiar formulario
      cargarCursos(); // Recargar lista
    } else {
      toast.error(result.error || 'Error al guardar el curso');
    }
  };

  const handleDelete = async (cursoId: number) => {
    if (!confirm('¿Seguro que deseas eliminar este curso? También se borrará el diploma.')) return;
    
    setIsDeleting(cursoId);
    const result = await eliminarCurso(cursoId);
    setIsDeleting(null);

    if (result.success) {
      toast.success('Curso eliminado');
      cargarCursos();
    } else {
      toast.error(result.error || 'Error al eliminar');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--surface-color)', padding: '2.5rem',
        borderRadius: '16px', width: '100%', maxWidth: '700px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Cursos de {voluntario.nombre}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)'
          }}>
            &times;
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
          {/* Formulario para añadir nuevo curso */}
          <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Añadir Nuevo Curso</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-group">
                  <label>Nombre del Curso *</label>
                  <CustomSelect 
                    name={isCustomCurso ? "" : "nombre"} 
                    options={opcionesCursos}
                    placeholder="Seleccione un curso..."
                    required={!isCustomCurso}
                    onChange={(value) => {
                      if (value === 'Otro') {
                        setIsCustomCurso(true);
                      } else {
                        setIsCustomCurso(false);
                      }
                    }}
                  />
                  {isCustomCurso && (
                    <input 
                      type="text" 
                      name="nombre" 
                      required 
                      placeholder="Escriba el nombre del curso..." 
                      className="search-input" 
                      style={{ backgroundColor: 'white', marginTop: '0.5rem' }} 
                      autoFocus
                    />
                  )}
                </div>
                <div className="input-group">
                  <label>Institución *</label>
                  <input type="text" name="institucion" required defaultValue="Cruz Roja Panameña" className="search-input" style={{ backgroundColor: 'white' }} />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label>Foto del Diploma (Opcional)</label>
                <input type="file" name="diploma" accept="image/*,application/pdf" className="search-input" style={{ backgroundColor: 'white', padding: '0.5rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="primary-button" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Guardando...' : '+ Añadir Curso'}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de cursos actuales */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Historial de Capacitaciones</h3>
            
            {isLoading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando cursos...</p>
            ) : cursos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                No hay cursos registrados para este voluntario.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cursos.map(curso => (
                  <div key={curso.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--cruz-roja-red)' }}>{curso.nombre}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{curso.institucion}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {curso.diplomaUrl && (
                        <a href={curso.diplomaUrl} target="_blank" rel="noopener noreferrer" className="secondary-button" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                          📄 Ver Diploma
                        </a>
                      )}
                      <button 
                        type="button" 
                        onClick={() => handleDelete(curso.id)}
                        disabled={isDeleting === curso.id}
                        className="danger-button" 
                        style={{ padding: '0.5rem', opacity: isDeleting === curso.id ? 0.5 : 1 }}
                        title="Eliminar curso"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
