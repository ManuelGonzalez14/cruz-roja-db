import React from 'react';
import { cerrarSesion } from '../acciones/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      {/* Barra Lateral (Sidebar) */}
      <aside className="sidebar">
        <div className="sidebar-header" style={{ justifyContent: 'center', marginBottom: '2rem', width: '100%' }}>
          <img src="/logo.png" alt="Cruz Roja Panameña" style={{ width: '100%', maxWidth: '210px', height: 'auto', objectFit: 'contain' }} />
        </div>

        <nav className="sidebar-nav">
          <a href="/" className="nav-item active">
            <span className="nav-icon">👥</span>
            Voluntarios
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🚑</span>
            Ambulancias
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🏥</span>
            Pacientes
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🚨</span>
            Incidentes
          </a>
        </nav>

        <div className="sidebar-footer">
          <form action={cerrarSesion}>
            <button 
              type="submit" 
              className="nav-item" 
              style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}
            >
              <span className="nav-icon">🚪</span>
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
