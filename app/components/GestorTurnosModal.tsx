'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { crearTurno, actualizarTurno } from '../acciones/turnos';
import toast from 'react-hot-toast';
import CustomSelect from './CustomSelect';

interface GestorTurnosModalProps {
  isOpen: boolean;
  onClose: () => void;
  turnoEdit?: any;
}

export default function GestorTurnosModal({ isOpen, onClose, turnoEdit }: GestorTurnosModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    ubicacion: '',
    habilidadesRequeridas: '',
    cuposMaximos: 1,
    estado: 'Abierto'
  });

  useEffect(() => {
    if (turnoEdit) {
      setFormData({
        titulo: turnoEdit.titulo || '',
        descripcion: turnoEdit.descripcion || '',
        fechaInicio: new Date(turnoEdit.fechaInicio).toISOString().slice(0, 16),
        fechaFin: new Date(turnoEdit.fechaFin).toISOString().slice(0, 16),
        ubicacion: turnoEdit.ubicacion || '',
        habilidadesRequeridas: turnoEdit.habilidadesRequeridas || '',
        cuposMaximos: turnoEdit.cuposMaximos || 1,
        estado: turnoEdit.estado || 'Abierto'
      });
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        ubicacion: '',
        habilidadesRequeridas: '',
        cuposMaximos: 1,
        estado: 'Abierto'
      });
    }
  }, [turnoEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cuposMaximos' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        fechaInicio: new Date(formData.fechaInicio),
        fechaFin: new Date(formData.fechaFin)
      };

      if (turnoEdit) {
        await actualizarTurno(turnoEdit.id, dataToSubmit);
        toast.success('Turno actualizado correctamente');
      } else {
        await crearTurno(dataToSubmit);
        toast.success('Turno creado correctamente');
      }
      onClose();
    } catch (error) {
      toast.error('Ocurrió un error al guardar el turno');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      padding: '2rem'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--surface-color)', padding: '1.5rem 2.5rem',
        borderRadius: '16px', width: '100%', maxWidth: '1000px',
        border: '2px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{turnoEdit ? 'Editar Turno' : 'Nuevo Turno'}</h2>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
            
            {/* COLUMNA IZQUIERDA: Detalles Principales */}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>📝 Detalles Principales</h3>

              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Título del Turno *</label>
                <input
                  type="text"
                  name="titulo"
                  required
                  value={formData.titulo}
                  onChange={handleChange}
                  className="search-input"
                  placeholder="Ej: Cobertura Médica Maratón"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="input-group">
                  <label>Fecha y Hora Inicio *</label>
                  <input
                    type="datetime-local"
                    name="fechaInicio"
                    required
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    className="search-input"
                  />
                </div>
                <div className="input-group">
                  <label>Fecha y Hora Fin *</label>
                  <input
                    type="datetime-local"
                    name="fechaFin"
                    required
                    value={formData.fechaFin}
                    onChange={handleChange}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Descripción / Notas</label>
                <textarea
                  name="descripcion"
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="search-input"
                  placeholder="Detalles adicionales del turno..."
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
            </div>

            {/* COLUMNA DERECHA: Logística y Operativa */}
            <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1rem 1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>⚙️ Logística y Operativa</h3>
              
              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="search-input"
                  placeholder="Ej: Estadio Nacional"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="input-group">
                  <label>Cupos Máximos *</label>
                  <input
                    type="number"
                    name="cuposMaximos"
                    min="1"
                    required
                    value={formData.cuposMaximos}
                    onChange={handleChange}
                    className="search-input"
                  />
                </div>
                <div className="input-group">
                  <label>Estado</label>
                  <CustomSelect
                    name="estado"
                    value={formData.estado}
                    onChange={(val) => setFormData(prev => ({ ...prev, estado: val }))}
                    options={[
                      { value: "Abierto", label: "Abierto" },
                      { value: "Cerrado", label: "Cerrado" },
                      { value: "Cancelado", label: "Cancelado" },
                      { value: "Completado", label: "Completado" }
                    ]}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Habilidades Requeridas</label>
                <input
                  type="text"
                  name="habilidadesRequeridas"
                  value={formData.habilidadesRequeridas}
                  onChange={handleChange}
                  className="search-input"
                  placeholder="Ej: RCP, Primeros Auxilios"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="secondary-button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-button"
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Guardando...' : (turnoEdit ? 'Guardar Cambios' : 'Guardar Turno')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
