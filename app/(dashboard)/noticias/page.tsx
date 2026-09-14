import React from 'react';

export default function NoticiasPage() {
  return (
    <div className="page-container page-noticias" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ textAlign: 'center', backgroundColor: 'var(--surface-color)', padding: '4rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', maxWidth: '500px', width: '100%' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#cbd5e1' }}>🚧</div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '2rem' }}>Coming Soon</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          El módulo de <strong>Comunidad y Anuncios</strong> se encuentra actualmente en construcción.
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          Próximamente conectaremos nuestras redes sociales y habilitaremos la sección de noticias oficiales del Comité.
        </p>
      </div>
    </div>
  );
}
