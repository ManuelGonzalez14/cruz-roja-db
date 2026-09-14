import React from 'react';
import { cerrarSesion } from '../acciones/auth';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import AdminMejorasButton from '../components/AdminMejorasButton';
import NavLink from '../components/NavLink';
import ThemeToggle from '../components/ThemeToggle';
import UserNav from '../components/UserNav';

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
        nombreVoluntario = usuario.voluntario.nombre.split(' ')[0] || 'Voluntario'; // Solo primer nombre
      } else {
        nombreVoluntario = usuario.email.split('@')[0] || 'Usuario'; // Fallback to email prefix if no profile
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
                <NavLink href="/gestionar-turnos" className="">Turnos</NavLink>
                <NavLink href="/gestionar-capacitaciones" className="">Capacitaciones</NavLink>
                <NavLink href="/gestionar-comunidad" className="">Comunidad</NavLink>
                <NavLink href="/gestionar-soporte" className="">Soporte</NavLink>
                {isDesarrollador ? (
                  <>
                    <NavLink href="/mejoras" className="">Mejoras e Ideas</NavLink>
                    <NavLink href="/dev-logs" className="">Logs del Sistema</NavLink>
                  </>
                ) : (
                  <AdminMejorasButton variant="top" />
                )}
              </>
            )}
          </nav>

          <UserNav 
            nombreVoluntario={nombreVoluntario}
            isVoluntario={isVoluntario}
            isDesarrollador={isDesarrollador}
          />
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
                <NavLink href="/gestionar-turnos" className="icon-btn" tooltip="Turnos">📅</NavLink>
                <NavLink href="/gestionar-capacitaciones" className="icon-btn" tooltip="Capacitaciones">📚</NavLink>
                <NavLink href="/gestionar-comunidad" className="icon-btn" tooltip="Comunidad Admin">📰</NavLink>
                <NavLink href="/gestionar-soporte" className="icon-btn" tooltip="Soporte Admin">❓</NavLink>
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
