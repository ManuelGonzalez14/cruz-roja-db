import React from 'react';

export default function NoticiasPage() {
  return (
    <div className="page-container page-noticias">
      <div className="noticias-header">
        <h2>Noticias para Voluntarios</h2>
        <div className="noticias-filters">
          <button className="active">Todo</button>
          <button>Misiones</button>
          <button>Actualizaciones</button>
          <button>Eventos</button>
          <button className="btn-solid-dark">Crear Actualización</button>
        </div>
      </div>

      <div className="noticias-layout">
        <div className="noticias-main">
          {/* Hero News Card */}
          <div className="news-hero-card">
            <div className="hero-content">
              <h3>Misión de Rescate Reciente:<br/>Rescate en Montaña en Pico Apex</h3>
              <p>Misión de rescate reciente: Voluntarios de Rescate en Montaña en Pico Apex asistiendo a un herido en Pico Apex.</p>
              <button className="btn-solid-red">Leer Historia Completa</button>
            </div>
            <div className="hero-badge">👥 Voluntarios: 12 Involucrados &nbsp;&nbsp; hace 1h</div>
          </div>

          {/* News Grid */}
          <div className="news-grid">
            <div className="news-card">
              <div className="card-top">
                <span className="news-tag red-tag">📢 Anuncios</span>
                <span className="news-time">hace 3h</span>
              </div>
              <h4>Nuevas Fechas de Capacitación en Primeros Auxilios</h4>
              <p>Nuevos horarios de certificación de RCP disponibles</p>
              <div className="card-bottom">
                <a href="#" className="read-more">Leer Más ›</a>
                <div className="avatar-group">
                  <img src="https://i.pravatar.cc/150?img=1" alt="v1"/>
                  <img src="https://i.pravatar.cc/150?img=2" alt="v2"/>
                  <img src="https://i.pravatar.cc/150?img=3" alt="v3"/>
                </div>
              </div>
            </div>

            <div className="news-card">
              <div className="card-top">
                <span className="news-tag blue-tag">📍 Actualizaciones</span>
                <span className="news-time">hace 5h</span>
              </div>
              <h4>Colecta de Suministros: Necesidad Crítica de Agua</h4>
              <p>Recolección urgente en marcha en Seattle</p>
              <div className="card-bottom">
                <a href="#" className="read-more">Leer Más ›</a>
                <div className="avatar-group">
                  <img src="https://i.pravatar.cc/150?img=4" alt="v1"/>
                  <img src="https://i.pravatar.cc/150?img=5" alt="v2"/>
                </div>
              </div>
            </div>

            <div className="news-card">
              <div className="card-top">
                <span className="news-tag orange-tag">🔥 Misiones</span>
                <span className="news-time">hace 8h</span>
              </div>
              <h4>Apoyo en Incendios Forestales: Actualización</h4>
              <p>Equipos desplegados en el Valle de Napa, sigan las pautas</p>
              <div className="card-bottom">
                <a href="#" className="read-more">Leer Más ›</a>
                <div className="avatar-group">
                  <img src="https://i.pravatar.cc/150?img=6" alt="v1"/>
                </div>
              </div>
            </div>

            <div className="news-card">
              <div className="card-top">
                <span className="news-tag purple-tag">📅 Eventos</span>
                <span className="news-time">hace 1d</span>
              </div>
              <h4>Gala Anual: ¡Únete a Nosotros!</h4>
              <p>Boletos a la venta para la recaudación de fondos de noviembre</p>
              <div className="card-bottom">
                <a href="#" className="read-more">Leer Más ›</a>
                <div className="avatar-group">
                  <img src="https://i.pravatar.cc/150?img=7" alt="v1"/>
                  <img src="https://i.pravatar.cc/150?img=8" alt="v2"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="noticias-sidebar">
          <div className="sidebar-section">
            <h4>Próximos Eventos</h4>
            <div className="sidebar-item">
              <p><strong>Nuevas Fechas de Capacitación en Primeros Auxilios</strong></p>
              <p className="sub">Nuevos horarios de certificación de RCP disponibles</p>
              <a href="#">Leer Más ›</a>
            </div>
          </div>

          <div className="sidebar-section">
            <h4>Misiones Activas</h4>
            <div className="mission-item">
              <span className="mission-icon red">🔥</span>
              <div className="mission-info">
                <p><strong>Colecta de Suministros:</strong></p>
                <p>Necesidad Crítica</p>
              </div>
            </div>
            <div className="mission-item">
              <span className="mission-icon blue">📍</span>
              <div className="mission-info">
                <p><strong>Misiones Activas</strong></p>
                <p>Actualización de Voluntarios</p>
              </div>
            </div>
            <a href="#" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--cruz-roja-red)', fontWeight: 'bold' }}>Leer Más ›</a>
          </div>

          <div className="sidebar-section">
            <h4>Mejores Voluntarios</h4>
            <div className="top-volunteer-item">
              <img src="https://i.pravatar.cc/150?img=47" alt="V" />
              <div>
                <p><strong>Sarah J.</strong></p>
                <p className="sub">Voluntarios</p>
              </div>
            </div>
            <div className="top-volunteer-item">
              <img src="https://i.pravatar.cc/150?img=12" alt="V" />
              <div>
                <p><strong>Cana Stopha</strong></p>
                <p className="sub">Voluntarios</p>
              </div>
            </div>
            <div className="top-volunteer-item">
              <img src="https://i.pravatar.cc/150?img=32" alt="V" />
              <div>
                <p><strong>Rslia Nirasea</strong></p>
                <p className="sub">Voluntarios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
