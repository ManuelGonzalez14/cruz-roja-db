import React from 'react';

export default function SoportePage() {
  return (
    <div className="page-container page-soporte">
      <div className="soporte-header">
        <h2>Centro de Ayuda y Soporte al Voluntario</h2>
        <p>Bienvenido al Centro de Ayuda y Soporte al Voluntario de la Cruz Roja</p>
      </div>

      <div className="soporte-layout">
        <div className="faq-section">
          <div className="faq-header">
            <h3>Preguntas Frecuentes</h3>
            <div className="search-bar">
              <span>🔍</span>
              <input type="text" placeholder="Buscar preguntas, artículos..." />
            </div>
          </div>

          <div className="faq-group">
            <h4>Políticas de Voluntarios</h4>
            <div className="faq-item">
              <span>Horas de Voluntariado: ¿Cómo registro mis horas?</span>
              <span className="faq-icon">[+]</span>
            </div>
            <div className="faq-item">
              <span>Actualizar Mi Perfil</span>
              <span className="faq-icon">⌄</span>
            </div>
          </div>

          <div className="faq-group">
            <h4>Gestión de Horas</h4>
            <div className="faq-item">
              <span>Gestión de Horas</span>
              <span className="faq-icon">⌄</span>
            </div>
          </div>

          <div className="faq-group">
            <h4>Soporte Técnico</h4>
            <div className="faq-item">
              <span>Módulos de Capacitación</span>
              <span className="faq-icon">[+]</span>
            </div>
          </div>

          <div className="faq-group">
            <h4>Capacitación</h4>
            <div className="faq-item">
              <span>Reporte de Gastos</span>
              <span className="faq-icon">[+]</span>
            </div>
          </div>
        </div>

        <div className="contact-section glass-card">
          <h3>Contactar Soporte / Problemas Técnicos</h3>
          <p>¿Necesitas ayuda con el portal o la aplicación? Envía tu consulta técnica a continuación.</p>
          
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Asunto</label>
                <select>
                  <option>Problema al registrar horas</option>
                  <option>Actualización de perfil</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input type="email" defaultValue="sarah.j@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label>Descripción Detallada</label>
              <textarea placeholder="Por favor describe tu problema..." rows={5}></textarea>
            </div>
            <button type="button" className="btn-solid-red" style={{ width: '100%', marginTop: '1rem' }}>Enviar Ticket</button>
          </form>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="chat-fab">
        <span className="chat-icon">💬</span>
        <span>Chat en Vivo</span>
      </button>
    </div>
  );
}
