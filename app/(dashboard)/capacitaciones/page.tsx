import React from 'react';

export default function CapacitacionesPage() {
  return (
    <div className="page-container page-capacitaciones">
      <div className="cap-header">
        <div className="cap-welcome">
          <h2>¡Bienvenido(a) de nuevo, Jane!</h2>
          <h1>Cursos de Capacitación Disponibles</h1>
        </div>
        
        <div className="cap-toolbar">
          <div className="cap-search">
            <span>🔍</span>
            <input type="text" placeholder="Buscar cursos..." />
          </div>
          <div className="cap-filters">
            <select><option>Categoría</option></select>
            <select><option>Estado</option></select>
            <select><option>Duración</option></select>
          </div>
        </div>
      </div>

      <div className="cap-layout">
        <div className="courses-grid">
          
          <div className="course-card">
            <div className="course-icon-top red-shadow">❤️<span className="plus-tiny">✚</span></div>
            <h3>Certificación RCP/DEA</h3>
            <p>Aprende técnicas para salvar vidas</p>
            <div className="course-stats">
              <span>Progreso 65%</span>
              <span>2 hrs</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill red-fill" style={{ width: '65%' }}></div>
            </div>
            <button className="btn-solid-red full-width">Continuar</button>
          </div>

          <div className="course-card">
            <div className="course-icon-top">🧰</div>
            <h3>Primeros Auxilios Estándar</h3>
            <p>Habilidades esenciales para lesiones</p>
            <div className="course-stats">
              <span>Progreso 30%</span>
              <span>2 hrs</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill dark-fill" style={{ width: '30%' }}></div>
            </div>
            <button className="btn-solid-red full-width">Continuar</button>
          </div>

          <div className="course-card">
            <div className="course-icon-top">🏠</div>
            <h3>Resp. Básica a Desastres</h3>
            <p>Responder a desastres naturales</p>
            <div className="course-stats">
              <span>⏱️ 2 hrs</span>
              <span>0%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '0%' }}></div>
            </div>
            <button className="btn-solid-red full-width">Inscribirse</button>
          </div>

          <div className="course-card">
            <div className="course-icon-top red-drop">🩸</div>
            <h3>Op. Donación de Sangre</h3>
            <p>Aprende técnicas para salvar vidas</p>
            <div className="course-stats">
              <span>⏱️ 2 hrs</span>
              <span>0%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '0%' }}></div>
            </div>
            <button className="btn-solid-red full-width">Inscribirse</button>
          </div>

          <div className="course-card">
            <div className="course-icon-top">🧠</div>
            <h3>Primeros Auxilios Psicológicos</h3>
            <p>Habilidades esenciales para lesiones</p>
            <div className="course-stats">
              <span>⏱️ 2 hrs</span>
              <span>0%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '0%' }}></div>
            </div>
            <button className="btn-solid-red full-width">Inscribirse</button>
          </div>

          <div className="course-card">
            <div className="course-icon-top">🔦</div>
            <h3>Prep. para Emergencias</h3>
            <p>Responder a desastres naturales</p>
            <div className="course-stats">
              <span>⏱️ 2 hrs</span>
              <span>0%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '0%' }}></div>
            </div>
            <button className="btn-solid-red full-width">Inscribirse</button>
          </div>

        </div>

        <div className="cap-sidebar">
          <div className="sidebar-section">
            <h4>Cursos Actuales</h4>
            
            <div className="mini-course">
              <p>RCP</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill dark-fill" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="mini-course">
              <p>Primeros Auxilios</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill dark-fill" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h4>Módulos Completados</h4>
            <p className="completed-count">Total 14</p>
          </div>
        </div>
      </div>
    </div>
  );
}
