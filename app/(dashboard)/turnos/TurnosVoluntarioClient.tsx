'use client';

import React, { useState } from 'react';
import { inscribirseEnTurno, cancelarInscripcionTurno } from '../../acciones/turnos';
import toast from 'react-hot-toast';

export default function TurnosVoluntarioClient({ turnosIniciales, voluntarioId }: { turnosIniciales: any[], voluntarioId: number }) {
  const [turnos, setTurnos] = useState(turnosIniciales);
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'mes' | 'semana' | 'dia' | 'lista'>('mes');

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysStart = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()));
  const prevWeek = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
  const nextWeek = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
  const prevDay = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
  const nextDay = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getLocalISODate = (d: Date | string) => {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  const handleInscribirse = async (turnoId: number) => {
    if (!voluntarioId) {
      toast.error('Necesitas configurar tu perfil de voluntario primero.');
      return;
    }
    setIsSubmitting(true);
    try {
      await inscribirseEnTurno(turnoId, voluntarioId);
      toast.success('Inscripción exitosa');
      const updatedTurnos = turnos.map(t => {
        if (t.id === turnoId) {
          return { ...t, voluntariosInscritos: [...t.voluntariosInscritos, { voluntarioId }] };
        }
        return t;
      });
      setTurnos(updatedTurnos);
      if (selectedTurno) setSelectedTurno(updatedTurnos.find(t => t.id === selectedTurno.id));
    } catch (error: any) {
      toast.error(error.message || 'Error al inscribirse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = async (turnoId: number) => {
    if (!voluntarioId) return;
    setIsSubmitting(true);
    try {
      await cancelarInscripcionTurno(turnoId, voluntarioId);
      toast.success('Inscripción cancelada');
      const updatedTurnos = turnos.map(t => {
        if (t.id === turnoId) {
          return { ...t, voluntariosInscritos: t.voluntariosInscritos.filter((v: any) => v.voluntarioId !== voluntarioId) };
        }
        return t;
      });
      setTurnos(updatedTurnos);
      if (selectedTurno) setSelectedTurno(updatedTurnos.find(t => t.id === selectedTurno.id));
    } catch (error: any) {
      toast.error('Error al cancelar inscripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVista = () => {
    if (viewMode === 'lista') {
      let turnosAMostrar = turnos;
      return (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {turnosAMostrar.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No hay turnos para mostrar en esta vista.
            </div>
          ) : (
            turnosAMostrar.map(t => {
              const estoyInscrito = t.voluntariosInscritos.some((v: any) => v.voluntarioId === voluntarioId);
              const isLleno = t.voluntariosInscritos.length >= t.cuposMaximos;
              
              let stateColor = '#ff3b30';
              let stateBg = 'rgba(255, 59, 48, 0.1)';
              let stateLabel = `Lleno`;
              
              if (estoyInscrito) {
                stateColor = 'var(--cruz-roja-red)';
                stateBg = 'rgba(230,0,0,0.1)';
                stateLabel = 'Inscrito';
              } else if (!isLleno) {
                stateColor = '#34c759';
                stateBg = 'rgba(52, 199, 89, 0.1)';
                stateLabel = 'Disponible';
              }

              return (
                <div 
                  key={t.id} 
                  onClick={() => setSelectedTurno(t)}
                  style={{ 
                    padding: '1.5rem', 
                    backgroundColor: 'var(--glass-bg)', 
                    border: selectedTurno?.id === t.id ? '2px solid var(--cruz-roja-red)' : '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{t.titulo}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      📅 {new Date(t.fechaInicio).toLocaleDateString()} | 🕒 {new Date(t.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {t.voluntariosInscritos.length} / {t.cuposMaximos} Cupos
                     </span>
                     <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, backgroundColor: stateBg, color: stateColor }}>
                       {stateLabel}
                     </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      );
    }

    if (viewMode === 'semana') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
      });

      return (
        <>
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevWeek}>‹</button>
            <h3>Semana del {weekDays[0]?.getDate()} {weekDays[0] && monthNames[weekDays[0].getMonth()]}</h3>
            <button className="cal-nav-btn" onClick={nextWeek}>›</button>
          </div>
          <div className="cal-grid-full">
            {days.map((d, i) => (
              <div key={d} className="cal-col-header">
                {d} {weekDays[i]?.getDate()}
              </div>
            ))}
            {weekDays.map(d => {
              const currentDayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
              const isToday = currentDayStr === getLocalISODate(new Date());
              const dayTurnos = turnos.filter(t => getLocalISODate(t.fechaInicio) === currentDayStr);
              
              let state = 'empty';
              let label = '';
              let turnoItem = null;
              if (dayTurnos.length > 0) {
                turnoItem = dayTurnos[0];
                const estoyInscrito = turnoItem.voluntariosInscritos.some((v: any) => v.voluntarioId === voluntarioId);
                const isLleno = turnoItem.voluntariosInscritos.length >= turnoItem.cuposMaximos;
                if (estoyInscrito) { state = 'booked'; label = `Reservado:\n${turnoItem.titulo}`; }
                else if (!isLleno) { state = 'available'; label = `Disponible:\n${turnoItem.titulo}`; }
                else { state = 'booked'; label = `Lleno:\n${turnoItem.titulo}`; }
                if (isToday) state = estoyInscrito ? 'today-booked' : 'today-available';
              }
              return (
                <div key={d.toISOString()} className={`cal-cell ${state !== 'empty' ? state : ''}`} onClick={() => turnoItem && setSelectedTurno(turnoItem)} style={{ cursor: turnoItem ? 'pointer' : 'default', minHeight: '300px' }}>
                  {isToday && <div className="cal-date-row" style={{justifyContent: 'center'}}><span className="today-badge">Hoy</span></div>}
                  {dayTurnos.map(t => {
                    const estoyInscrito = t.voluntariosInscritos.some((v: any) => v.voluntarioId === voluntarioId);
                    const pillClass = estoyInscrito ? 'booked' : 'available';
                    return <div key={t.id} className={`shift-pill ${pillClass}`} onClick={(e) => { e.stopPropagation(); setSelectedTurno(t); }} style={{ marginTop: '0.25rem', padding: '0.5rem', whiteSpace: 'normal', fontSize: '0.75rem' }}>{new Date(t.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}<br/>{t.titulo}</div>
                  })}
                </div>
              );
            })}
          </div>
        </>
      )
    }

    if (viewMode === 'dia') {
      const currentDayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const isToday = currentDayStr === getLocalISODate(new Date());
      const dayTurnos = turnos.filter(t => getLocalISODate(t.fechaInicio) === currentDayStr);

      return (
        <>
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevDay}>‹</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3>{currentDate.getDate()} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              {isToday && <span className="today-badge">Hoy</span>}
            </div>
            <button className="cal-nav-btn" onClick={nextDay}>›</button>
          </div>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dayTurnos.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                 No hay turnos programados para este día.
               </div>
            ) : dayTurnos.map(t => {
              const estoyInscrito = t.voluntariosInscritos.some((v: any) => v.voluntarioId === voluntarioId);
              const pillClass = estoyInscrito ? 'booked' : 'available';
              return (
                <div key={t.id} onClick={() => setSelectedTurno(t)} style={{ backgroundColor: 'var(--glass-bg)', border: `1px solid var(--glass-border)`, borderRadius: '12px', padding: '1rem', display: 'flex', cursor: 'pointer', gap: '1rem' }}>
                  <div style={{ minWidth: '80px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {new Date(t.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div style={{ flex: 1, paddingLeft: '1rem', borderLeft: '3px solid', borderLeftColor: estoyInscrito ? 'var(--cruz-roja-red)' : '#10b981' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{t.titulo}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.descripcion || 'Sin descripción'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )
    }

    // Vista de Mes (Por defecto)
    return (
      <>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>

        <div className="cal-grid-full">
          {days.map(d => <div key={d} className="cal-col-header">{d}</div>)}
          {emptyDaysStart.map(d => (
            <div key={`empty-${d}`} className="cal-cell empty"></div>
          ))}
          {dates.map(d => {
            const currentDayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = currentDayStr === getLocalISODate(new Date());
            
            const dayTurnos = turnos.filter(t => getLocalISODate(t.fechaInicio) === currentDayStr);

            let state = 'empty';
            let label = '';
            let turnoItem = null;

            if (dayTurnos.length > 0) {
              turnoItem = dayTurnos[0];
              const estoyInscrito = turnoItem.voluntariosInscritos.some((v: any) => v.voluntarioId === voluntarioId);
              const isLleno = turnoItem.voluntariosInscritos.length >= turnoItem.cuposMaximos;

              if (estoyInscrito) {
                state = 'booked';
                label = `Reservado:\n${turnoItem.titulo}`;
              } else if (!isLleno) {
                state = 'available';
                label = `Disponible:\n${turnoItem.titulo}`;
              } else {
                state = 'booked';
                label = `Lleno:\n${turnoItem.titulo}`;
              }
              
              if (isToday) {
                state = estoyInscrito ? 'today-booked' : 'today-available';
              }
            }

            return (
              <div key={d} className={`cal-cell ${state !== 'empty' ? state : ''}`} onClick={() => turnoItem && setSelectedTurno(turnoItem)} style={{ cursor: turnoItem ? 'pointer' : 'default' }}>
                <div className="cal-date-row">
                  <span className="cal-date">{d}</span>
                  {isToday && <span className="today-badge">Hoy</span>}
                </div>
                {state !== 'empty' && (
                  <div className={`shift-pill ${state}`}>{label}</div>
                )}
                {dayTurnos.length > 1 && (
                  <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '4px', color: 'var(--text-secondary)' }}>
                    +{dayTurnos.length - 1} más
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="page-container page-turnos">
      <div className="turnos-header">
        <h2>Calendario de turnos y actividades</h2>
        <div className="turnos-actions">
          <button className="btn-outline">≡ Filtros</button>
          <div className="view-toggle">
            <button className={viewMode === 'mes' ? 'active' : ''} onClick={() => setViewMode('mes')}>Mes</button>
            <button className={viewMode === 'semana' ? 'active' : ''} onClick={() => setViewMode('semana')}>Semana</button>
            <button className={viewMode === 'dia' ? 'active' : ''} onClick={() => setViewMode('dia')}>Día</button>
            <button className={viewMode === 'lista' ? 'active' : ''} onClick={() => setViewMode('lista')}>Lista</button>
          </div>
        </div>
      </div>

      <div className="turnos-layout">
        <div className="turnos-main">
          {renderVista()}
        </div>

        {/* Side Panel: Shift Details */}
        <div className="turnos-sidebar">
          {selectedTurno ? (
            <>
              <div className="shift-card-header red-gradient-card">
                <h4>Detalles del Turno:<br/>{selectedTurno.titulo}</h4>
                <div className="shift-time">
                  <span>📅 {new Date(selectedTurno.fechaInicio).toLocaleDateString()}</span>
                  <span>🕒 {new Date(selectedTurno.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(selectedTurno.fechaFin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="shift-cross-bg">+</div>
              </div>
              <div className="shift-card-body">
                <div className="detail-section">
                  <h5>Descripción</h5>
                  <p>{selectedTurno.descripcion || 'Sin descripción'}</p>
                </div>
                <div className="detail-section row-split">
                  <div>
                    <h5>Ubicación</h5>
                    <p>{selectedTurno.ubicacion || 'Por definir'}</p>
                  </div>
                  <div className="map-placeholder">📍 Mapa</div>
                </div>
                <div className="detail-section">
                  <h5>Habilidades Requeridas</h5>
                  <p>{selectedTurno.habilidadesRequeridas || 'Ninguna especificada'}</p>
                </div>
                <div className="detail-section">
                  <h5>Cupos Disponibles</h5>
                  <p>{selectedTurno.cuposMaximos - selectedTurno.voluntariosInscritos.length} de {selectedTurno.cuposMaximos}</p>
                </div>
                
                <div className="detail-section">
                  <h5>Estado</h5>
                  {selectedTurno.voluntariosInscritos.some((v: any) => v.voluntarioId === voluntarioId) ? (
                     <p className="status-confirmed">Inscrito Confirmado</p>
                  ) : (
                    selectedTurno.voluntariosInscritos.length >= selectedTurno.cuposMaximos ? (
                      <p style={{ color: 'var(--text-secondary)' }}>Turno Lleno</p>
                    ) : (
                      <p style={{ color: '#34c759' }}>Disponible</p>
                    )
                  )}
                </div>
                
                <div className="shift-card-actions">
                  {selectedTurno.voluntariosInscritos.some((v: any) => v.voluntarioId === voluntarioId) ? (
                    <button 
                      className="btn-outline-red" 
                      onClick={() => handleCancelar(selectedTurno.id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Cancelando...' : 'Cancelar Inscripción'}
                    </button>
                  ) : selectedTurno.voluntariosInscritos.length < selectedTurno.cuposMaximos ? (
                    <button 
                      className="btn-solid-red" 
                      onClick={() => handleInscribirse(selectedTurno.id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Inscribiendo...' : 'Inscribirse al Turno'}
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>Selecciona un turno en el calendario para ver los detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
