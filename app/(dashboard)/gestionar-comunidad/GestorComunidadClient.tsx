"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { crearNoticia, eliminarNoticia } from '../../acciones/comunidad';

export default function GestorComunidadClient({ noticiasIniciales }: { noticiasIniciales: any[] }) {
  const [noticias, setNoticias] = useState(noticiasIniciales);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCrear = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await crearNoticia(formData);
    
    if (result.success) {
      toast.success("Noticia publicada exitosamente");
      setIsModalOpen(false);
      // Opcional: Recargar o actualizar estado
      window.location.reload();
    } else {
      toast.error(result.error || "Error al publicar");
    }
    setIsSubmitting(false);
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;
    const result = await eliminarNoticia(id);
    if (result.success) {
      toast.success("Noticia eliminada");
      setNoticias(noticias.filter(n => n.id !== id));
    } else {
      toast.error(result.error || "Error al eliminar");
    }
  };

  return (
    <div className="gestor-comunidad-client">
      <div className="toolbar" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="primary-button" onClick={() => setIsModalOpen(true)}>+ Redactar Nueva Noticia</button>
      </div>

      <div className="table-container">
        {noticias.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No hay noticias publicadas aún.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Fecha de Publicación</th>
                <th>Autor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map((noticia: any) => (
                <tr key={noticia.id}>
                  <td style={{ fontWeight: 600 }}>{noticia.titulo}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 8px', borderRadius: '4px' }}>
                      {noticia.categoria}
                    </span>
                  </td>
                  <td>{new Date(noticia.creadoEn).toLocaleDateString()}</td>
                  <td>{noticia.autor?.email || 'Sistema'}</td>
                  <td>
                    <button onClick={() => handleEliminar(noticia.id)} className="btn-icon" style={{ color: 'var(--cruz-roja-red)' }} title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }} onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '100%', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>📰 Redactar Noticia</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--cruz-roja-red)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>✕</button>
            </div>
            <form onSubmit={handleCrear} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="input-group">
                <label>Título de la Noticia *</label>
                <input type="text" name="titulo" required className="search-input" />
              </div>
              <div className="input-group">
                <label>Categoría *</label>
                <select name="categoria" required className="search-input">
                  <option value="Anuncios">📢 Anuncios</option>
                  <option value="Actualizaciones">📍 Actualizaciones</option>
                  <option value="Eventos">📅 Eventos</option>
                  <option value="Misiones">🔥 Misiones</option>
                </select>
              </div>
              <div className="input-group">
                <label>Contenido *</label>
                <textarea name="contenido" required className="search-input" rows={6} style={{ resize: 'vertical' }} placeholder="Escribe el cuerpo de la noticia aquí..."></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary-button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? 'Publicando...' : 'Publicar Noticia'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
