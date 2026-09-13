import React from 'react';

export default function TurnosPage() {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="page-container page-turnos">
      <div className="turnos-header">
        <h2>Calendario</h2>
        <div className="turnos-actions">
          <button className="btn-outline">≡ Filtros</button>
          <div className="view-toggle">
            <button className="active">Mes</button>
            <button>Semana</button>
            <button>Día</button>
            <button>Lista</button>
          </div>
        </div>
      </div>

      <div className="turnos-layout">
        {/* Main Calendar Grid */}
        <div className="turnos-main">
          <div className="cal-nav">
            <button className="cal-nav-btn">‹</button>
            <h3>Abril 2024</h3>
            <button className="cal-nav-btn">›</button>
          </div>

          <div className="cal-grid-full">
            {days.map(d => <div key={d} className="cal-col-header">{d}</div>)}
            {/* 31 previous month */}
            <div className="cal-cell empty">
              <span className="cal-date">31</span>
            </div>
            {dates.map(d => {
              // Mock logic for colors
              let state = 'available'; // available, booked, today
              let label = 'Disponible:\n3 Turnos';
              if (d === 14) { state = 'today-booked'; label = 'Reservado:\nEmergencia\nMédica'; }
              if (d === 15) { state = 'today-available'; }
              if (d === 21 || d === 27) { state = 'booked'; label = 'Reservado:\nAlivio de Desastres'; }

              return (
                <div key={d} className={`cal-cell ${state}`}>
                  <div className="cal-date-row">
                    <span className="cal-date">{d}</span>
                    {d === 15 && <span className="today-badge">Hoy</span>}
                  </div>
                  <div className={`shift-pill ${state}`}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel: Shift Details */}
        <div className="turnos-sidebar">
          <div className="shift-card-header red-gradient-card">
            <h4>Detalles del Turno:<br/>Emergencia Médica</h4>
            <div className="shift-time">
              <span>📅 Domingo, 14 de Abril de 2024</span>
              <span>🕒 08:00 AM - 04:00 PM</span>
            </div>
            <div className="shift-cross-bg">+</div>
          </div>
          <div className="shift-card-body">
            <div className="detail-section">
              <h5>Descripción</h5>
              <p>Apoyar al equipo de paramédicos durante el evento de maratón local, y ayudar a brindar atenciones y proveer intervenciones de emergencia.</p>
            </div>
            <div className="detail-section row-split">
              <div>
                <h5>Ubicación</h5>
                <p>Estación Cruz Roja 3<br/>120 Calle Principal</p>
              </div>
              <div className="map-placeholder">📍 Mapa</div>
            </div>
            <div className="detail-section">
              <h5>Rol</h5>
              <p>Técnico en Emergencias Médicas</p>
            </div>
            <div className="detail-section">
              <h5>Habilidades Requeridas</h5>
              <p>Primeros Auxilios, RCP, Paramédico Básico</p>
            </div>
            <div className="detail-section">
              <h5>Notas</h5>
              <p>Nota: equipo paramédico desplegado en el evento de maratón.</p>
            </div>
            <div className="detail-section">
              <h5>Estado</h5>
              <p className="status-confirmed">Confirmado - Asignado a Sarah Jenkins</p>
            </div>
            
            <div className="shift-card-actions">
              <button className="btn-outline-red">Cancelar Turno</button>
              <button className="btn-solid-red">Contactar Equipo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
