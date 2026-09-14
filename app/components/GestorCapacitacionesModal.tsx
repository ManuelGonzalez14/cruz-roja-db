'use client';

import React, { useState, useEffect } from 'react';
import { crearCapacitacion, actualizarCapacitacion } from '../acciones/capacitaciones';
import toast from 'react-hot-toast';
import CustomSelect from './CustomSelect';

interface GestorCapacitacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  capacitacionEdit?: any;
}

export default function GestorCapacitacionesModal({ isOpen, onClose, capacitacionEdit }: GestorCapacitacionesModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diasClase, setDiasClase] = useState<string[]>([]);
  const [nuevoDia, setNuevoDia] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    horaInicio: '08:00',
    horaFin: '12:00',
    ubicacion: '',
    instructor: '',
    cuposMaximos: 10,
    estado: 'Programada'
  });

  useEffect(() => {
    if (capacitacionEdit) {
      setFormData({
        titulo: capacitacionEdit.titulo || '',
        descripcion: capacitacionEdit.descripcion || '',
        horaInicio: capacitacionEdit.horaInicio || '08:00',
        horaFin: capacitacionEdit.horaFin || '12:00',
        ubicacion: capacitacionEdit.ubicacion || '',
        instructor: capacitacionEdit.instructor || '',
        cuposMaximos: capacitacionEdit.cuposMaximos || 10,
        estado: capacitacionEdit.estado || 'Programada'
      });
      if (capacitacionEdit.diasClase && capacitacionEdit.diasClase.length > 0) {
        setDiasClase(capacitacionEdit.diasClase.map((d: any) => new Date(d).toISOString().slice(0, 10)));
      } else if (capacitacionEdit.fechaInicio) {
        setDiasClase([new Date(capacitacionEdit.fechaInicio).toISOString().slice(0, 10)]);
      }
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        horaInicio: '08:00',
        horaFin: '12:00',
        ubicacion: '',
        instructor: '',
        cuposMaximos: 10,
        estado: 'Programada'
      });
      setDiasClase([]);
    }
  }, [capacitacionEdit, isOpen]);

  const agregarDia = () => {
    if (nuevoDia && !diasClase.includes(nuevoDia)) {
      setDiasClase([...diasClase, nuevoDia].sort());
      setNuevoDia('');
    }
  };

  const eliminarDia = (diaAEliminar: string) => {
    setDiasClase(diasClase.filter(d => d !== diaAEliminar));
  };

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
    if (diasClase.length === 0) {
      toast.error('Debe añadir al menos un día de clases');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        fechaInicio: diasClase[0]!,
        fechaFin: diasClase[diasClase.length - 1]!,
        diasClase
      };

      if (capacitacionEdit) {
        const res = await actualizarCapacitacion(capacitacionEdit.id, dataToSubmit);
        if (res.success) {
          toast.success('Capacitación actualizada correctamente');
          onClose();
        } else {
          toast.error(res.error || 'Error al actualizar');
        }
      } else {
        const res = await crearCapacitacion(dataToSubmit);
        if (res.success) {
          toast.success('Capacitación creada correctamente');
          onClose();
        } else {
          toast.error(res.error || 'Error al crear');
        }
      }
    } catch (error) {
      toast.error('Ocurrió un error al guardar la capacitación');
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
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{capacitacionEdit ? 'Editar Capacitación' : 'Nueva Capacitación'}</h2>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
            
            {/* COLUMNA IZQUIERDA: Detalles Principales */}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>📚 Detalles de la Capacitación</h3>

              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Título de la Capacitación *</label>
                <input
                  type="text"
                  name="titulo"
                  required
                  value={formData.titulo}
                  onChange={handleChange}
                  className="search-input"
                  placeholder="Ej: Curso de Primeros Auxilios"
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Días de Clases *</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'stretch' }}>
                  <input
                    type="date"
                    value={nuevoDia}
                    onChange={(e) => setNuevoDia(e.target.value)}
                    className="search-input"
                    style={{ flex: 1, padding: '0.75rem 1rem' }}
                  />
                  <button type="button" onClick={agregarDia} className="primary-button" style={{ padding: '0 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Añadir</button>
                </div>
                
                {diasClase.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {diasClase.map(dia => (
                      <span key={dia} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--cruz-roja-red)', padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        {new Date(dia).toLocaleDateString()}
                        <button type="button" onClick={() => eliminarDia(dia)} style={{ background: 'transparent', border: 'none', color: 'var(--cruz-roja-red)', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>&times;</button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: 0 }}>No hay días seleccionados.</p>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Hora de Inicio *</label>
                  <input
                    type="time"
                    name="horaInicio"
                    required
                    value={formData.horaInicio}
                    onChange={handleChange}
                    className="search-input"
                    style={{ width: '100%', padding: '0.75rem 1rem' }}
                  />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Hora de Fin *</label>
                  <input
                    type="time"
                    name="horaFin"
                    required
                    value={formData.horaFin}
                    onChange={handleChange}
                    className="search-input"
                    style={{ width: '100%', padding: '0.75rem 1rem' }}
                  />
                </div>
              </div>

            </div>

            {/* COLUMNA DERECHA: Logística y Operativa */}
            <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1rem 1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>⚙️ Organización</h3>
              
              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="search-input"
                  placeholder="Ej: Sede Principal, Salón 2"
                />
              </div>

              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Instructor Responsable</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="search-input"
                  placeholder="Ej: Juan Pérez"
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
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Estado</label>
                  <CustomSelect
                    name="estado"
                    value={formData.estado}
                    onChange={(val) => setFormData(prev => ({ ...prev, estado: val }))}
                    options={[
                      { value: "Programada", label: "Programada" },
                      { value: "En Curso", label: "En Curso" },
                      { value: "Finalizada", label: "Finalizada" },
                      { value: "Cancelada", label: "Cancelada" }
                    ]}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* FILA INFERIOR: Descripción */}
          <div className="input-group" style={{ marginBottom: '0.75rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Descripción / Temario</label>
            <textarea
              name="descripcion"
              rows={4}
              value={formData.descripcion}
              onChange={handleChange}
              className="search-input"
              placeholder="Temas a tratar en la capacitación..."
              style={{ resize: 'vertical', width: '100%', padding: '0.75rem 1rem' }}
            ></textarea>
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
              {isSubmitting ? 'Guardando...' : (capacitacionEdit ? 'Guardar Cambios' : 'Guardar Capacitación')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
