import React from 'react';
import { cerrarSesion } from '../acciones/auth';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import AdminMejorasButton from '../components/AdminMejorasButton';
import NavLink from '../components/NavLink';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_cruz_roja')?.value;
  
  let rol = 'ADMIN';
  let nombreVoluntario = 'Admin';
  if (sessionId) {
    const prisma = new PrismaClient();
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(sessionId) },
      include: { voluntario: true }
    });
    if (usuario) {
      rol = usuario.rol;
      if (usuario.voluntario) {
        nombreVoluntario = usuario.voluntario.nombre.split(' ')[0]; // Solo primer nombre
      } else {
        nombreVoluntario = usuario.email.split('@')[0]; // Fallback to email prefix if no profile
      }
    }
  }
  const tempRol = cookieStore.get('temp_rol')?.value;
  if (tempRol) rol = tempRol;

  const isVoluntario = rol === 'VOLUNTARIO';
  const isDesarrollador = rol === 'DESARROLLADOR';

  return (
    <div className="volunteer-glass-layout">
      <div className="bg-circle-1"></div>
      <div className="bg-circle-2"></div>
      
      <div className="glass-app-container">
        {/* TOP BAR */}
        <header className="glass-topbar">
          <div className="brand-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--cruz-roja-red)', fontSize: '2rem', fontWeight: 900, lineHeight: 1, textShadow: '0 0 10px rgba(230,0,0,0.3)' }}>✚</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: 'normal', margin: 0 }}>
                Cruz Roja Panameña
              </h2>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '-2px' }}>
                {isVoluntario ? 'Voluntariado' : (isDesarrollador ? 'Sistema (Dev)' : 'Administración')}
              </span>
            </div>
          </div>

          <nav className="top-nav-links">
            {isVoluntario ? (
              <>
                <NavLink href="/" className="" exact>Inicio</NavLink>
                <NavLink href="/perfil" className="">Perfil</NavLink>
                <NavLink href="/turnos" className="">Turnos</NavLink>
                <NavLink href="/capacitaciones" className="">Capacitaciones</NavLink>
                <NavLink href="/noticias" className="">Comunidad</NavLink>
                <NavLink href="/soporte" className="">Soporte</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/" className="" exact>Voluntarios</NavLink>
                <NavLink href="/ambulancias" className="">Ambulancias</NavLink>
                {isDesarrollador ? (
                  <NavLink href="/mejoras" className="">Mejoras e Ideas</NavLink>
                ) : (
                  <AdminMejorasButton variant="top" />
                )}
              </>
            )}
          </nav>

          <div className="user-mini-profile">
            {isDesarrollador ? (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cruz-roja-red)', fontSize: '1.4rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                ✚
              </div>
            ) : (
              <img 
                src={isVoluntario ? "https://i.pravatar.cc/150?img=47" : "https://i.pravatar.cc/150?img=11"} 
                alt="Profile" 
              />
            )}
            <span style={{ textTransform: 'capitalize' }}>
              {isDesarrollador ? `${nombreVoluntario} DEV` : nombreVoluntario} ⌄
            </span>
          </div>
        </header>

        {/* BODY */}
        <div className="glass-body-layout">
          {/* SLIM SIDEBAR */}
          <aside className="slim-icon-sidebar">
            {isVoluntario ? (
              <>
                <NavLink href="/" className="icon-btn" exact tooltip="Inicio">✚</NavLink>
                <NavLink href="/perfil" className="icon-btn" tooltip="Perfil">👤</NavLink>
                <NavLink href="/turnos" className="icon-btn" tooltip="Mis Turnos">📅</NavLink>
                <NavLink href="/capacitaciones" className="icon-btn" tooltip="Capacitación">🎓</NavLink>
                <NavLink href="/noticias" className="icon-btn" tooltip="Comunidad">📰</NavLink>
                <NavLink href="/soporte" className="icon-btn" tooltip="Soporte">❓</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/" className="icon-btn" exact tooltip="Voluntarios">👥</NavLink>
                <NavLink href="/ambulancias" className="icon-btn" tooltip="Ambulancias">🚑</NavLink>
                {isDesarrollador ? (
                  <NavLink href="/mejoras" className="icon-btn" tooltip="Mejoras e Ideas">💡</NavLink>
                ) : (
                  <AdminMejorasButton variant="side" />
                )}
              </>
            )}

            <form action={cerrarSesion} style={{ marginTop: 'auto' }}>
              <button type="submit" className="icon-btn icon-btn-logout" data-tooltip="Cerrar Sesión" style={{ border: 'none', cursor: 'pointer' }}>
                ↪
              </button>
            </form>
          </aside>
          
          {/* MAIN CONTENT */}
          <main className="glass-main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
