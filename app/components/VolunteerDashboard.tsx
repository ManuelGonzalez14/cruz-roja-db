"use client";

import React from 'react';

const SimpleCalendar = () => {
  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const dates = Array.from({length: 31}, (_, i) => i + 1);
  const currentDay = new Date().getDate();

  return (
    <div className="vd-calendar">
      <div className="vd-cal-header">
        <button className="vd-cal-btn">‹</button>
        <h4>{new Date().toLocaleDateString('es-PA', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}</h4>
        <button className="vd-cal-btn">›</button>
      </div>
      <div className="vd-cal-grid">
        {days.map((d, i) => <div key={i} className="vd-cal-day-name">{d}</div>)}
        {/* Espacios vacíos de ejemplo para empezar el mes en martes */}
        <div></div><div></div>
        {dates.map(d => (
          <div key={d} className={`vd-cal-date ${d === currentDay ? 'vd-cal-today' : ''}`}>
            {d}
            {(d === 15 || d === 22) && <div className="vd-cal-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function VolunteerDashboard({ voluntario, cursos }: { voluntario: any, cursos: any[] }) {
  const nombreCompleto = `${voluntario.nombre} ${voluntario.apellido}`;
  const iniciales = `${voluntario.nombre.charAt(0)}${voluntario.apellido.charAt(0)}`.toUpperCase();

  // Calcular tiempo como voluntario (meses)
  const mesesVoluntario = Math.max(1, Math.floor((new Date().getTime() - new Date(voluntario.creadoEn).getTime()) / (1000 * 60 * 60 * 24 * 30)));

  return (
    <div className="volunteer-dashboard">
      {/* Header Profile Section */}
      <div className="vd-header">
        <div className="vd-welcome">
          <h1>¡Bienvenido de nuevo,</h1>
          <h2>{nombreCompleto}!</h2>
        </div>
        <div className="vd-header-actions">
          <div className="vd-search">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Buscar cursos..." />
          </div>
          <button className="vd-icon-btn">🔔<span className="vd-badge">1</span></button>
          <div className="vd-profile-mini">
            {voluntario.fotoUrl ? (
              <img src={voluntario.fotoUrl} alt={voluntario.nombre} />
            ) : (
              <div className="vd-avatar-fallback">{iniciales}</div>
            )}
            <div className="vd-profile-info">
              <span className="vd-profile-name">{voluntario.nombre}</span>
              <span className="vd-profile-status">
                <span className="status-dot"></span> {voluntario.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <span className="vd-chevron">⌄</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="vd-grid">
        
        {/* Total Hours Card */}
        <div className="vd-card glass-card">
          <div className="vd-card-header">
            <h3>Tiempo de Servicio Activo</h3>
            <span className="vd-dots">•••</span>
          </div>
          <div className="vd-stats-big">
            <span className="vd-number">{mesesVoluntario}</span>
            <span className="vd-label">MESES</span>
          </div>
          {/* Decorative Graph SVG */}
          <div className="vd-graph">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none">
              <path d="M0,35 Q15,25 30,30 T60,20 T80,10 T100,15" fill="none" stroke="var(--cruz-roja-red)" strokeWidth="3" strokeLinecap="round" />
              <path d="M0,35 Q15,25 30,30 T60,20 T80,10 T100,15 L100,40 L0,40 Z" fill="url(#redGradient)" />
              <defs>
                <linearGradient id="redGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--cruz-roja-red)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--cruz-roja-red)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="vd-card-footer">
            <span>Desde {new Date(voluntario.creadoEn).getFullYear()}</span>
            <span className="vd-positive">+100% Compromiso</span>
          </div>
        </div>

        {/* Latest News / Courses Card */}
        <div className="vd-card glass-card vd-news-card">
          <div className="vd-card-header">
            <h3>Últimos Cursos Registrados</h3>
            <span className="vd-dots">•••</span>
          </div>
          <div className="vd-news-list">
            {cursos.length === 0 ? (
              <div className="vd-empty">No tienes cursos registrados.</div>
            ) : (
              cursos.slice(0, 3).map(curso => (
                <div className="vd-news-item" key={curso.id}>
                  <div className="vd-news-img">📚</div>
                  <div className="vd-news-content">
                    <h4>{curso.nombre}</h4>
                    <p>{curso.institucion}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Highlight Action Card (Red Gradient) */}
        <div className="vd-card red-gradient-card vd-highlight-card">
          <div className="vd-card-header">
            <h3>Estado del Voluntario</h3>
            <span className="vd-dots" style={{ color: 'white' }}>•••</span>
          </div>
          <div className="vd-highlight-content">
            <div className="vd-highlight-info">
              <p>👤 <strong>Especialidad:</strong> {voluntario.especialidad || 'No asignada'}</p>
              <p>🩸 <strong>Tipo de Sangre:</strong> {voluntario.tipoSangre || 'Desconocido'}</p>
              <p>👕 <strong>Talla:</strong> {voluntario.tallaUniforme || 'No especificada'}</p>
            </div>
            <button className="vd-btn-white">ACTUALIZAR PERFIL</button>
          </div>
        </div>

      </div>

      <div className="vd-grid-bottom" style={{ gridTemplateColumns: '1.2fr 1fr 1fr' }}>
        {/* Recent Activities */}
        <div className="vd-card glass-card">
          <div className="vd-card-header">
            <h3>Actividades Recientes</h3>
            <span className="vd-dots">•••</span>
          </div>
          <div className="vd-activities-list">
            <div className="vd-activity-item">
              <div className="vd-activity-icon">✅</div>
              <div className="vd-activity-details">
                <h4>Ingreso al Sistema</h4>
                <p>{new Date(voluntario.creadoEn).toLocaleDateString('es-PA')} • Registro Oficial</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="vd-card glass-card">
          <div className="vd-card-header" style={{ marginBottom: '0.5rem' }}>
            <h3>Calendario de Turnos</h3>
          </div>
          <SimpleCalendar />
        </div>

        {/* Training Progress */}
        <div className="vd-card glass-card">
          <div className="vd-card-header">
            <h3>Progreso de Capacitación</h3>
          </div>
          <div className="vd-progress-list">
            <div className="vd-progress-item">
              <div className="vd-progress-icon">🚑</div>
              <div className="vd-progress-text">
                <h4>Cursos Completados</h4>
                <p>{cursos.length} certificados</p>
              </div>
              <span className="vd-chevron-right">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
