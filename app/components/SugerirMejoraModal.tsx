"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { crearMejora } from '../acciones/mejoras';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SugerirMejoraModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await crearMejora(formData);
    
    if (result.success) {
      toast.success('¡Sugerencia enviada al desarrollador!');
      onClose();
    } else {
      toast.error(result.error || 'Error al enviar sugerencia');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💡 Sugerir Mejora al Desarrollador</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div className="input-group">
            <label>Título de la Idea / Mejora *</label>
            <input 
              type="text" 
              name="titulo" 
              placeholder="Ej. Añadir opción de descargar en PDF..." 
              required 
              className="search-input"
              autoFocus
            />
          </div>
          
          <div className="input-group">
            <label>Descripción detallada (Opcional)</label>
            <textarea 
              name="descripcion" 
              placeholder="Explica un poco más qué necesitas..." 
              className="search-input"
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>
          
          <div className="modal-footer" style={{ marginTop: '1rem' }}>
            <button type="button" className="secondary-button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Idea 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
