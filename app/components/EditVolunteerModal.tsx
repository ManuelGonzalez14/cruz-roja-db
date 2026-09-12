"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { actualizarVoluntario, eliminarVoluntario } from '../acciones/voluntarios';
import CustomSelect from './CustomSelect';

const opcionesEspecialidad = [
  { value: "Aspirante", label: "Aspirante" },
  { value: "Voluntario", label: "Voluntario" },
  { value: "Paramédico", label: "Paramédico" },
  { value: "Rescatista", label: "Rescatista" },
  { value: "Chofer", label: "Chofer" },
  { value: "Apoyo Logístico", label: "Apoyo Logístico" },
  { value: "Administrativo", label: "Administrativo" }
];

const opcionesSangre = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" }
];

const opcionesTalla = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" }
];

interface Props {
  voluntario: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditVolunteerModal({ voluntario, isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(voluntario?.fotoUrl || null);
  const [activo, setActivo] = useState<boolean>(voluntario?.activo ?? true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !voluntario) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('activo', activo.toString());
    
    const result = await actualizarVoluntario(voluntario.id, formData);
    
    if (result.success) {
      toast.success('Voluntario actualizado exitosamente');
      onClose();
    } else {
      toast.error(result.error || 'Ocurrió un error al guardar');
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás completamente seguro de eliminar a este voluntario? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    const result = await eliminarVoluntario(voluntario.id);
    
    if (result.success) {
      toast.success('Voluntario eliminado');
      onClose();
    } else {
      toast.error(result.error || 'Ocurrió un error al eliminar');
      setIsDeleting(false);
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
        borderRadius: '16px', width: '100%', maxWidth: '1200px',
        border: '2px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Editar Voluntario</h2>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
            
            {/* COLUMNA IZQUIERDA: Info Personal y Emergencia */}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>👤 Información Personal</h3>


              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="input-group">
                  <label>Primer Nombre *</label>
                  <input type="text" name="nombre" defaultValue={voluntario.nombre} required placeholder="Juan" className="search-input" />
                </div>
                <div className="input-group">
                  <label>Segundo Nombre</label>
                  <input type="text" name="segundoNombre" defaultValue={voluntario.segundoNombre || ''} placeholder="Antonio" className="search-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="input-group">
                  <label>Primer Apellido *</label>
                  <input type="text" name="apellido" defaultValue={voluntario.apellido} required placeholder="Pérez" className="search-input" />
                </div>
                <div className="input-group">
                  <label>Segundo Apellido</label>
                  <input type="text" name="segundoApellido" defaultValue={voluntario.segundoApellido || ''} placeholder="García" className="search-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="input-group">
                  <label>Cédula *</label>
                  <input type="text" name="cedula" required defaultValue={voluntario.cedula} className="search-input" />
                </div>
                <div className="input-group">
                  <label>N° de Carnet (Opcional)</label>
                  <input type="text" name="numeroCarnet" defaultValue={voluntario.numeroCarnet || ''} placeholder="Ej. 12345" className="search-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="input-group">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" name="fechaNacimiento" defaultValue={voluntario.fechaNacimiento ? new Date(voluntario.fechaNacimiento).toISOString().split('T')[0] : ''} className="search-input" />
                </div>
                <div className="input-group">
                  <label>Teléfono</label>
                  <input type="tel" name="telefono" defaultValue={voluntario.telefono || ''} className="search-input" />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Dirección</label>
                <input type="text" name="direccion" defaultValue={voluntario.direccion || ''} placeholder="Las Tablas, Los Santos..." className="search-input" />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>🆘 Contacto de Emergencia</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div className="input-group">
                    <label>Nombre de Contacto</label>
                    <input type="text" name="contactoEmergNombre" defaultValue={voluntario.contactoEmergNombre || ''} placeholder="Familiar o Amigo" className="search-input" />
                  </div>
                  <div className="input-group">
                    <label>Teléfono de Emergencia</label>
                    <input type="tel" name="contactoEmergTelefono" defaultValue={voluntario.contactoEmergTelefono || ''} placeholder="6123-4567" className="search-input" />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Foto, Perfil Médico y Estado */}
            <div style={{ backgroundColor: 'var(--bg-color-alt)', padding: '1rem 1.5rem', borderRadius: '16px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '90px', height: '90px', borderRadius: '50%', 
                  backgroundColor: 'white', border: '2px dashed var(--border-color)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
                  cursor: 'pointer'
                }} onClick={() => document.getElementById('fotoUploadEdit')?.click()}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem', color: 'var(--text-tertiary)' }}>📷</span>
                  )}
                </div>
                <label style={{ fontSize: '0.85rem', color: 'var(--cruz-roja-red)', cursor: 'pointer', fontWeight: 600 }} htmlFor="fotoUploadEdit">
                  Cambiar Foto de Perfil
                </label>
                <input type="file" id="fotoUploadEdit" name="foto" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </div>

              <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                <label style={{ marginBottom: 0, fontWeight: 600 }}>Estado del Voluntario</label>
                <button 
                  type="button"
                  onClick={() => setActivo(!activo)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
                    backgroundColor: activo ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                    color: activo ? '#059669' : '#4b5563',
                    transition: 'all 0.2s'
                  }}
                >
                  {activo ? 'ACTIVO' : 'INACTIVO'}
                </button>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>⚕️ Perfil Médico y Operativo</h3>
            
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="input-group">
                  <label>Especialidad</label>
                  <CustomSelect 
                    name="especialidad" 
                    options={opcionesEspecialidad} 
                    placeholder="Seleccione especialidad..." 
                    value={voluntario.especialidad || ""}
                  />
                </div>

                <div className="input-group">
                  <label>Tipo de Sangre</label>
                  <CustomSelect 
                    name="tipoSangre" 
                    options={opcionesSangre} 
                    placeholder="Desconocido" 
                    value={voluntario.tipoSangre || ""}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                <label>Talla de Uniforme</label>
                <CustomSelect 
                  name="tallaUniforme" 
                  options={opcionesTalla} 
                  placeholder="Seleccione talla..." 
                  value={voluntario.tallaUniforme || ""}
                />
              </div>

              <div className="input-group">
                <label>Alergias o Condiciones Médicas (Opcional)</label>
                <input type="text" name="alergias" defaultValue={voluntario.alergias || ''} placeholder="Ej. Alérgico a la penicilina, asma..." className="search-input" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={handleDelete} disabled={isDeleting} className="danger-button" style={{
              opacity: isDeleting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              {isDeleting ? 'Borrando...' : <><span>🗑️</span> Eliminar</>}
            </button>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={onClose} className="secondary-button">
                Cancelar
              </button>
              <button type="submit" className="primary-button" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
