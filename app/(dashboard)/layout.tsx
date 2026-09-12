import React from 'react';
import { cerrarSesion } from '../acciones/auth';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import AdminMejorasButton from '../components/AdminMejorasButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_cruz_roja')?.value;
  
  let rol = 'ADMIN';
  if (sessionId) {
    const prisma = new PrismaClient();
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(sessionId) }
    });
    if (usuario) {
      rol = usuario.rol;
    }
  }
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

          {rol === 'DESARROLLADOR' ? (
            <>
              <div style={{ margin: '2rem 0 0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                👨‍💻 Desarrollador
              </div>
              <a href="/mejoras" className="nav-item">
                <span className="nav-icon">💡</span>
                Mejoras e Ideas
              </a>
            </>
          ) : (
            <>
              <div style={{ margin: '2rem 0 0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                📝 Sugerencias
              </div>
              <AdminMejorasButton />
            </>
          )}
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
