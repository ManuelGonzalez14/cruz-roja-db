import React from 'react';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_cruz_roja')?.value;
  
  if (!sessionId) {
    redirect('/');
  }

  const prisma = new PrismaClient();
  const usuario = await prisma.usuario.findUnique({
    where: { id: parseInt(sessionId) },
    include: { voluntario: true }
  });

  const voluntario = usuario?.voluntario;
  
  if (!voluntario) {
    return <div style={{padding: '2rem'}}>Error: No se encontró la información del voluntario. Asegúrese de tener un perfil de voluntario vinculado.</div>;
  }

  const nombreCompleto = `${voluntario.nombre} ${voluntario.segundoNombre || ''} ${voluntario.apellido} ${voluntario.segundoApellido || ''}`.replace(/\s+/g, ' ').trim();
  const idVoluntario = voluntario.numeroCarnet || voluntario.cedula; 
  
  const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
  const fechaIngreso = voluntario.creadoEn ? formatter.format(new Date(voluntario.creadoEn)) : 'Desconocido';
  // Capitalize first letter of month
  const fechaIngresoCap = fechaIngreso.charAt(0).toUpperCase() + fechaIngreso.slice(1);

  return (
    <div className="page-container page-perfil">
      
      {/* Top Banner Profile */}
      <div className="profile-hero">
        <div className="profile-red-bar"></div>
        <div className="profile-hero-content">
          <div className="profile-info-left">
            <h1>{nombreCompleto.toUpperCase()}</h1>
            <p className="profile-subtitle">ID Voluntario: {idVoluntario} | Miembro Desde: {fechaIngresoCap}</p>
            
            <div className="profile-progress-container">
              <div className="progress-text-row">
                <span className="level-text">Próximo Nivel: <strong>Voluntario Senior</strong></span>
                <span className="level-pct">78% (780/1000 hrs)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '78%' }}></div>
              </div>
              <div className="progress-labels">
                <span>Voluntario Experimentado</span>
                <span>Voluntario Senior</span>
              </div>
            </div>
          </div>
          
          <div className="profile-avatar-wrapper">
            <div className="avatar-ring">
              <img src="https://i.pravatar.cc/150?img=47" alt="Profile" />
              <div className="status-badge">🟢 Activo</div>
              <div className="plus-badge">+</div>
            </div>
          </div>

          <div className="profile-stats-right">
            <div className="stat-row">
              <span className="stat-icon">🕒</span> Total de Horas <strong>912</strong>
            </div>
            <div className="stat-row">
              <span className="stat-icon">🚑</span> Misiones <strong>14</strong>
            </div>
            <div className="stat-row">
              <span className="stat-icon">🎓</span> Capacitaciones <strong>9</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Badges & Courses */}
      <div className="profile-grid">
        {/* Gamification Badges */}
        <div className="profile-card">
          <h3>Insignias de Gamificación</h3>
          <div className="badges-grid">
            <div className="badge-item">
              <div className="badge-icon bronze-medal">⏱️</div>
              <h4>Servicio de 100 Horas</h4>
              <p>100 Hrs</p>
            </div>
            <div className="badge-item">
              <div className="badge-icon gold-medal">❤️</div>
              <h4>Experto Certificado en RCP</h4>
            </div>
            <div className="badge-item">
              <div className="badge-icon star-medal">⭐</div>
              <h4>Héroe Comunitario</h4>
            </div>
            <div className="badge-item">
              <div className="badge-icon circle-medal">✚</div>
              <h4>Certificado en Primeros Auxilios</h4>
            </div>
            <div className="badge-item">
              <div className="badge-icon circle-medal">🚑</div>
              <h4>Respuesta a Desastres</h4>
            </div>
            <div className="badge-item">
              <div className="badge-icon circle-medal">🩸</div>
              <h4>Líder de Donación de Sangre</h4>
            </div>
          </div>
        </div>

        {/* Completed Training Courses */}
        <div className="profile-card">
          <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cursos de Capacitación Completados</h3>
          <div className="courses-list">
            
            <div className="course-item">
              <div className="course-icon red-bg">✚</div>
              <div className="course-info">
                <h4>Primeros Auxilios y RCP/DEA</h4>
                <p>Mayo 2023</p>
              </div>
              <div className="course-status certified">✓ Certificado</div>
            </div>

            <div className="course-item">
              <div className="course-icon pink-bg">🌍</div>
              <div className="course-info">
                <h4>Introducción a Servicios en Desastres</h4>
                <p>Ago 2022</p>
              </div>
              <div className="course-status certified">✓ Certificado</div>
            </div>

            <div className="course-item">
              <div className="course-icon gray-bg">🧠</div>
              <div className="course-info">
                <h4>Primeros Auxilios Psicológicos</h4>
                <p>Nov 2023</p>
              </div>
              <div className="course-status completed">✓ Completado</div>
            </div>

            <div className="course-item">
              <div className="course-icon pink-bg">🏠</div>
              <div className="course-info">
                <h4>Operaciones de Refugio</h4>
                <p>Feb 2024</p>
              </div>
              <div className="course-status certified">✓ Certificado</div>
            </div>

            <div className="course-item">
              <div className="course-icon pink-bg">👥</div>
              <div className="course-info">
                <h4>Conceptos Básicos de Cuidado Masivo</h4>
                <p>Oct 2022</p>
              </div>
              <div className="course-status certified">✓ Certificado</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
