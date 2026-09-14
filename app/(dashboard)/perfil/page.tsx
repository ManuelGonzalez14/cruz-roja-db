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

  const prisma = new PrismaClient() as any;
  const usuario = await prisma.usuario.findUnique({
    where: { id: parseInt(sessionId) }
  });

  if (!usuario?.voluntarioId) {
    return <div style={{padding: '2rem'}}>Error: No se encontró la información del voluntario. Asegúrese de tener un perfil de voluntario vinculado.</div>;
  }

  // @ts-ignore
  const voluntario: any = await prisma.voluntario.findUnique({
    where: { id: usuario.voluntarioId },
    include: {
      turnos: { include: { turno: true } },
      capacitaciones: { include: { capacitacion: true } },
      cursos: true
    }
  });

  if (!voluntario) {
    return <div style={{padding: '2rem'}}>Error: No se encontró la información del voluntario en la base de datos.</div>;
  }

  const nombreCompleto = `${voluntario.nombre} ${voluntario.segundoNombre || ''} ${voluntario.apellido} ${voluntario.segundoApellido || ''}`.replace(/\s+/g, ' ').trim();
  const idVoluntario = voluntario.numeroCarnet || voluntario.cedula; 
  
  const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
  const fechaIngreso = voluntario.creadoEn ? formatter.format(new Date(voluntario.creadoEn)) : 'Desconocido';
  const fechaIngresoCap = fechaIngreso.charAt(0).toUpperCase() + fechaIngreso.slice(1);

  // Cálculos dinámicos
  let misiones = 0;
  let totalHoras = 0;

  voluntario.turnos.forEach((tv: any) => {
    if (tv.turno.estado === 'Completado') {
      misiones++;
      if (tv.turno.fechaInicio && tv.turno.fechaFin) {
        const start = new Date(tv.turno.fechaInicio).getTime();
        const end = new Date(tv.turno.fechaFin).getTime();
        totalHoras += Math.max(0, Math.round((end - start) / 3600000));
      }
    }
  });

  const capacitacionesBD = voluntario.capacitaciones.filter((c: any) => c.capacitacion.estado === 'Finalizada').map((c: any) => {
    // Sumar horas del curso a las horas totales
    let horasCapacitacion = 0;
    try {
      const [hInicioStr, mInicioStr] = (c.capacitacion.horaInicio || '00:00').split(':');
      const [hFinStr, mFinStr] = (c.capacitacion.horaFin || '00:00').split(':');
      const inicioDec = parseInt(hInicioStr) + (parseInt(mInicioStr) || 0) / 60;
      const finDec = parseInt(hFinStr) + (parseInt(mFinStr) || 0) / 60;
      let horasPorDia = Math.max(0, finDec - inicioDec);
      let dias = (c.capacitacion.diasClase && c.capacitacion.diasClase.length > 0) ? c.capacitacion.diasClase.length : 1;
      horasCapacitacion = Math.round(horasPorDia * dias);
    } catch(e) {}
    
    totalHoras += horasCapacitacion;

    return {
      titulo: c.capacitacion.titulo,
      fecha: formatter.format(new Date(c.capacitacion.fechaFin)),
      tipo: 'capacitacion',
      icon: '✚',
      bgClass: 'red-bg'
    };
  });

  const cursosExternos = voluntario.cursos.map((c: any) => ({
    titulo: c.nombre,
    fecha: c.fecha ? formatter.format(new Date(c.fecha)) : 'Sin fecha',
    tipo: 'curso',
    icon: '🎓',
    bgClass: 'pink-bg'
  }));

  const todosLosCursos = [...capacitacionesBD, ...cursosExternos];
  const totalCapacitaciones = todosLosCursos.length;

  // Lógica de Niveles
  const niveles = [
    { nombre: 'Voluntario Novato', maxHoras: 50 },
    { nombre: 'Voluntario Activo', maxHoras: 200 },
    { nombre: 'Voluntario Experimentado', maxHoras: 500 },
    { nombre: 'Voluntario Senior', maxHoras: 1000 },
    { nombre: 'Voluntario Élite', maxHoras: Infinity }
  ];

  let nivelActual = niveles[0];
  let proximoNivel = niveles[1];
  
  for(let i = 0; i < niveles.length; i++) {
    if (totalHoras <= (niveles[i]?.maxHoras || 0)) {
      nivelActual = i > 0 ? niveles[i-1] : niveles[0];
      proximoNivel = niveles[i];
      if (totalHoras === 0) nivelActual = niveles[0];
      break;
    }
  }

  if (totalHoras >= 1000) {
    nivelActual = niveles[4];
    proximoNivel = niveles[4];
  }

  const minHoras = (nivelActual === niveles[0] && totalHoras < 50) ? 0 : (nivelActual?.maxHoras || 0);
  const maxHoras = proximoNivel?.maxHoras === Infinity ? totalHoras : (proximoNivel?.maxHoras || 100);
  let pct = 0;
  if (maxHoras !== minHoras) {
    pct = Math.min(100, Math.round(((totalHoras - minHoras) / (maxHoras - minHoras)) * 100));
  } else {
    pct = 100;
  }

  // Lógica de Insignias
  const insigniasGanadas = [];
  if (misiones > 0) insigniasGanadas.push({ icon: '🏅', title: 'Primera Misión', sub: '1 Misión', class: 'bronze-medal' });
  if (totalHoras >= 100) insigniasGanadas.push({ icon: '⏱️', title: 'Servicio de 100 Horas', sub: '100 Hrs', class: 'bronze-medal' });
  if (misiones >= 10) insigniasGanadas.push({ icon: '⭐', title: 'Héroe Comunitario', sub: '10 Misiones', class: 'star-medal' });
  if (totalCapacitaciones >= 3) insigniasGanadas.push({ icon: '🎓', title: 'Estudiante Ejemplar', sub: '3 Cursos', class: 'gold-medal' });
  
  const tienePrimerosAuxilios = voluntario.capacitaciones.some((c: any) => c.capacitacion.estado === 'Finalizada' && c.capacitacion.titulo.toLowerCase().includes('primeros auxilios'));
  if (tienePrimerosAuxilios) insigniasGanadas.push({ icon: '❤️', title: 'Certificado en RCP / PA', sub: 'Aprobado', class: 'gold-medal' });
  
  // Agregar placeholders si hay pocas insignias para mantener el diseño
  const insigniasRender = [...insigniasGanadas];
  const placeholders = [
    { icon: '🔒', title: 'Servicio de 500 Horas', sub: 'Bloqueado', class: 'circle-medal' },
    { icon: '🔒', title: 'Respuesta a Desastres', sub: 'Bloqueado', class: 'circle-medal' },
    { icon: '🔒', title: 'Líder de Donación', sub: 'Bloqueado', class: 'circle-medal' },
    { icon: '🔒', title: 'Instructor', sub: 'Bloqueado', class: 'circle-medal' },
    { icon: '🔒', title: 'Veterano', sub: 'Bloqueado', class: 'circle-medal' },
    { icon: '🔒', title: 'Élite', sub: 'Bloqueado', class: 'circle-medal' }
  ];
  
  let pIdx = 0;
  while(insigniasRender.length < 6 && pIdx < placeholders.length) {
    if (placeholders[pIdx]) {
      insigniasRender.push(placeholders[pIdx] as any);
    }
    pIdx++;
  }

  return (
    <div className="page-container page-perfil">
      
      {/* Top Banner Profile */}
      <div className="profile-hero">
        <div className="profile-red-bar"></div>
        <div className="profile-hero-content">
          <div className="profile-info-left">
            <h1>{nombreCompleto.toUpperCase()}</h1>
            <p className="profile-subtitle" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>ID Voluntario: {idVoluntario} | Miembro Desde: {fechaIngresoCap}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginLeft: '0.5rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }}></span>
                Activo
              </span>
            </p>
            
            <div className="profile-progress-container">
              <div className="progress-text-row">
                <span className="level-text">Próximo Nivel: <strong>{proximoNivel?.nombre || ''}</strong></span>
                <span className="level-pct">{pct}% ({totalHoras}/{maxHoras === totalHoras ? '∞' : maxHoras} hrs)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
              </div>
              <div className="progress-labels">
                <span>{nivelActual?.nombre || ''}</span>
                <span>{proximoNivel?.nombre || ''}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-avatar-wrapper">
            <div className="avatar-ring">
              <img src="https://i.pravatar.cc/150?img=47" alt="Profile" />
              <div className="plus-badge">+</div>
            </div>
          </div>

          <div className="profile-stats-right">
            <div className="stat-row">
              <span className="stat-icon">🕒</span> Total de Horas <strong>{totalHoras}</strong>
            </div>
            <div className="stat-row">
              <span className="stat-icon">🚑</span> Misiones <strong>{misiones}</strong>
            </div>
            <div className="stat-row">
              <span className="stat-icon">🎓</span> Capacitaciones <strong>{totalCapacitaciones}</strong>
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
            {insigniasRender.slice(0, 6).map((badge, idx) => (
              <div className="badge-item" key={idx} style={{ opacity: badge.sub === 'Bloqueado' ? 0.5 : 1 }}>
                <div className={`badge-icon ${badge.class}`}>{badge.icon}</div>
                <h4>{badge.title}</h4>
                {badge.sub && <p>{badge.sub}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Completed Training Courses */}
        <div className="profile-card">
          <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cursos de Capacitación Completados</h3>
          <div className="courses-list">
            
            {todosLosCursos.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Aún no has completado capacitaciones.</p>
            ) : (
              todosLosCursos.map((curso, idx) => {
                const colorBg = ['red-bg', 'pink-bg', 'gray-bg'][idx % 3];
                const icons = ['✚', '🌍', '🧠', '🏠', '👥'];
                const icon = icons[idx % icons.length];
                return (
                  <div className="course-item" key={idx}>
                    <div className={`course-icon ${colorBg}`}>{icon}</div>
                    <div className="course-info">
                      <h4>{curso.titulo}</h4>
                      <p>{curso.fecha}</p>
                    </div>
                    <div className="course-status certified">✓ Certificado</div>
                  </div>
                );
              })
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
