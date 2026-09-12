"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { crearMejora, actualizarEstadoMejora, eliminarMejora } from '../acciones/mejoras';

interface Mejora {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: string;
  creadoEn: Date;
}

export default function MejorasBoard({ initialMejoras }: { initialMejoras: Mejora[] }) {
  const [mejoras, setMejoras] = useState<Mejora[]>(initialMejoras);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columnas = ['Pendiente', 'En Progreso', 'Completado'];

  const handleCrearMejora = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await crearMejora(formData);
    if (result.success && result.mejora) {
      toast.success('Idea guardada');
      setMejoras([result.mejora, ...mejoras]);
      setIsAdding(false);
    } else {
      toast.error(result.error || 'Error al guardar la idea');
    }
    setIsSubmitting(false);
  };

  const handleMoverMejora = async (id: number, nuevoEstado: string) => {
    // Optimistic UI update
    const previousMejoras = [...mejoras];
    setMejoras(mejoras.map(m => m.id === id ? { ...m, estado: nuevoEstado } : m));
    
    const result = await actualizarEstadoMejora(id, nuevoEstado);
    if (!result.success) {
      toast.error('Error al mover');
      setMejoras(previousMejoras); // Rollback
    }
  };

  const handleEliminarMejora = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta idea?')) return;
    
    const previousMejoras = [...mejoras];
    setMejoras(mejoras.filter(m => m.id !== id));
    
    const result = await eliminarMejora(id);
    if (!result.success) {
      toast.error('Error al eliminar');
      setMejoras(previousMejoras); // Rollback
    } else {
      toast.success('Idea eliminada');
    }
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>💡 Registro de Mejoras</h1>
        <button className="primary-button" onClick={() => setIsAdding(true)}>+ Nueva Idea</button>
      </div>

      {isAdding && (
        <form onSubmit={handleCrearMejora} style={{ 
          backgroundColor: 'var(--surface-color)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          marginBottom: '2rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>💡 Registrar Nueva Mejora o Tarea</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              name="titulo" 
              placeholder="Título (ej. Añadir botón de impresión)" 
              required 
              className="search-input"
              autoFocus
            />
            <textarea 
              name="descripcion" 
              placeholder="Descripción opcional o detalles técnicos..." 
              className="search-input"
              rows={3}
              style={{ resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setIsAdding(false)} className="secondary-button" disabled={isSubmitting}>Cancelar</button>
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Idea'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        {columnas.map(columna => {
          const mejorasColumna = mejoras.filter(m => m.estado === columna);
          
          return (
            <div key={columna} style={{ 
              backgroundColor: 'var(--bg-color-alt)', 
              borderRadius: '16px', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: columna === 'Completado' ? '#10b981' : columna === 'En Progreso' ? '#f59e0b' : 'var(--text-primary)' }}>
                  {columna}
                </h3>
                <span style={{ backgroundColor: 'var(--border-color)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {mejorasColumna.length}
                </span>
              </div>

              {mejorasColumna.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                  Sin tareas aquí
                </div>
              ) : (
                mejorasColumna.map(mejora => (
                  <div key={mejora.id} style={{ 
                    backgroundColor: 'var(--surface-color)', 
                    padding: '1.25rem', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    position: 'relative'
                  }}>
                    <button 
                      onClick={() => handleEliminarMejora(mejora.id)}
                      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, transition: '0.2s' }}
                      onMouseOver={e => e.currentTarget.style.opacity = '1'}
                      onMouseOut={e => e.currentTarget.style.opacity = '0.5'}
                    >
                      ❌
                    </button>
                    <h4 style={{ margin: '0 0 0.5rem 0', paddingRight: '1rem' }}>{mejora.titulo}</h4>
                    {mejora.descripcion && (
                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{mejora.descripcion}</p>
                    )}
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      {columna !== 'Pendiente' && (
                        <button 
                          onClick={() => handleMoverMejora(mejora.id, columnas[columnas.indexOf(columna) - 1])}
                          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          ⬅️
                        </button>
                      )}
                      {columna !== 'Completado' && (
                        <button 
                          onClick={() => handleMoverMejora(mejora.id, columnas[columnas.indexOf(columna) + 1])}
                          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          ➡️
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
