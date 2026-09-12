"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { crearVoluntario } from '../acciones/voluntarios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewVolunteerModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

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
    
    // Llamada al Server Action
    const result = await crearVoluntario(formData);
    
    if (result.success) {
      toast.success('Voluntario registrado exitosamente');
      onClose();
      // Opcional: limpiar el formulario si no se desmonta
    } else {
      toast.error(result.error || 'Ocurrió un error al guardar');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--surface-color)', padding: '2.5rem',
        borderRadius: '16px', width: '100%', maxWidth: '550px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Nuevo Voluntario</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Subida de foto */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              backgroundColor: 'var(--bg-color-alt)', border: '2px dashed var(--border-color)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
              cursor: 'pointer'
            }} onClick={() => document.getElementById('fotoUpload')?.click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', color: 'var(--text-tertiary)' }}>📷</span>
              )}
            </div>
            <label style={{ fontSize: '0.85rem', color: 'var(--cruz-roja-red)', cursor: 'pointer', fontWeight: 600 }} htmlFor="fotoUpload">
              Subir Foto
            </label>
            <input type="file" id="fotoUpload" name="foto" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Nombre *</label>
              <input type="text" name="nombre" required placeholder="Juan" className="search-input" />
            </div>
            <div className="input-group">
              <label>Apellido *</label>
              <input type="text" name="apellido" required placeholder="Pérez" className="search-input" />
            </div>
          </div>

          <div className="input-group">
            <label>Cédula *</label>
            <input type="text" name="cedula" required placeholder="8-123-4567" className="search-input" />
          </div>

          <div className="input-group">
            <label>Teléfono</label>
            <input type="tel" name="telefono" placeholder="6123-4567" className="search-input" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="secondary-button">
              Cancelar
            </button>
            <button type="submit" className="primary-button" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Guardando...' : 'Guardar Voluntario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
