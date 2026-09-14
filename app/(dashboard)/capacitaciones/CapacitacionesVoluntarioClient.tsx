'use client';

import React, { useState, useTransition } from 'react';
import { BookOpen, MapPin, Clock, Users, User, CheckCircle2, Bell, Search, Star, Plus } from 'lucide-react';
import { inscribirseEnCapacitacion, cancelarInscripcionCapacitacion } from '../../acciones/capacitaciones';
import toast from 'react-hot-toast';
import DetallesCursoModal from '../../components/DetallesCursoModal';

export default function CapacitacionesVoluntarioClient({ capacitacionesIniciales, voluntarioId, nombreVoluntario }: { capacitacionesIniciales: any[], voluntarioId: number, nombreVoluntario?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [cursoSeleccionado, setCursoSeleccionado] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'activas' | 'ofertas'>('activas');

  const handleInscribirse = (capacitacionId: number) => {
    if (!voluntarioId) {
      toast.error('Debes iniciar sesión como voluntario para inscribirte.');
      return;
    }

    startTransition(async () => {
      const loadingToast = toast.loading('Inscribiendo...');
      try {
        const result = await inscribirseEnCapacitacion(capacitacionId, voluntarioId);
        if (result.success) {
          toast.success('¡Te has inscrito correctamente!', { id: loadingToast });
        } else {
          toast.error(result.error || 'Error al inscribirse', { id: loadingToast });
        }
      } catch (error) {
        toast.error('Error de conexión', { id: loadingToast });
      }
    });
  };

  const handleCancelarInscripcion = (capacitacionId: number) => {
    if (!voluntarioId) return;
    
    startTransition(async () => {
      const loadingToast = toast.loading('Cancelando inscripción...');
      try {
        const result = await cancelarInscripcionCapacitacion(capacitacionId, voluntarioId);
        if (result.success) {
          toast.success('Has salido del curso correctamente', { id: loadingToast });
          setCursoSeleccionado(null); // Cerrar modal si estaba abierto
        } else {
          toast.error(result.error || 'Error al salir del curso', { id: loadingToast });
        }
      } catch (error) {
        toast.error('Error de conexión', { id: loadingToast });
      }
    });
  };

  const filteredCapacitaciones = capacitacionesIniciales.filter(c => 
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de separación:
  // "Nuevas Ofertas": Cursos 'Programada' en los que el voluntario NO está inscrito.
  // "Próximas": Cursos en los que ya está inscrito, o que están 'En Curso'.
  const nuevasOfertas = filteredCapacitaciones.filter(c => 
    c.estado === 'Programada' && !c.inscripciones.some((i: any) => i.voluntarioId === voluntarioId)
  );
  
  const proximasCapacitaciones = filteredCapacitaciones.filter(c => 
    !(c.estado === 'Programada' && !c.inscripciones.some((i: any) => i.voluntarioId === voluntarioId))
  );

  // Calcular progreso promedio (Cursos Finalizados / Cursos Inscritos)
  const misCursos = capacitacionesIniciales.filter(c => c.inscripciones.some((i: any) => i.voluntarioId === voluntarioId));
  const cursosFinalizados = misCursos.filter(c => c.estado === 'Finalizada');
  let progresoGlobal = 0;
  if (misCursos.length > 0) {
    progresoGlobal = Math.round((cursosFinalizados.length / misCursos.length) * 100);
  }

  const Colors = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
            ¡Bienvenido(a){nombreVoluntario ? `, ${nombreVoluntario}` : ''}!
          </h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
            Desarrolla tus habilidades como voluntario(a).
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.05rem' }}>
            Explora y matricúlate en los próximos cursos de formación.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', backgroundColor: 'var(--surface-color)', borderRadius: '99px', padding: '0.5rem 1rem 0.5rem 2.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '150px' }}
            />
          </div>
          <select style={{ padding: '0.65rem 1.5rem', borderRadius: '99px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', appearance: 'none', outline: 'none' }}>
            <option>Nuevos</option>
            <option>Populares</option>
          </select>
          <select style={{ padding: '0.65rem 1.5rem', borderRadius: '99px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', appearance: 'none', outline: 'none' }}>
            <option>Filtrar</option>
          </select>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column (Courses) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* TAB NAVIGATION */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="view-toggle">
              <button className={activeTab === 'activas' ? 'active' : ''} onClick={() => setActiveTab('activas')}>Mis Capacitaciones Activas</button>
              <button className={activeTab === 'ofertas' ? 'active' : ''} onClick={() => setActiveTab('ofertas')}>Nuevas Ofertas de Formación</button>
            </div>
          </div>

          {/* ACTIVE TAB CONTENT */}
          {activeTab === 'activas' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {proximasCapacitaciones.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem', gridColumn: '1 / -1' }}>
                  No estás inscrito en ninguna capacitación.
                </div>
              ) : proximasCapacitaciones.map((capacitacion, index) => {
                const inscritos = capacitacion.inscripciones.length;
                const miInscripcion = capacitacion.inscripciones.find((i: any) => i.voluntarioId === voluntarioId);
                const isLleno = inscritos >= capacitacion.cuposMaximos;
                const duration = Math.max(1, Math.round((new Date(capacitacion.fechaFin).getTime() - new Date(capacitacion.fechaInicio).getTime()) / 3600000));
                
                const color = Colors[index % Colors.length];
                
                let stateText = 'Disponible';
                let stateColor = '#10b981';
                if (miInscripcion) {
                  stateText = 'Inscrito';
                  stateColor = '#007aff';
                } else if (capacitacion.estado === 'En Curso') {
                  stateText = 'En Progreso';
                  stateColor = '#f59e0b';
                } else if (isLleno) {
                  stateText = 'Lleno';
                  stateColor = '#ef4444';
                }

                return (
                  <div key={capacitacion.id} style={{ backgroundColor: 'var(--surface-color)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#d1d5db', fontWeight: 800, fontSize: '1.25rem' }}>{index + 1}</span>
                    
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: color, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: `0 8px 20px ${color}60` }}>
                      <BookOpen size={28} />
                    </div>
                    
                    <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {capacitacion.titulo}
                    </h3>
                    
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, flex: 1 }}>
                      <div style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} /> {capacitacion.horaInicio} - {capacitacion.horaFin}
                      </div>
                      <div style={{ marginBottom: '0.25rem' }}>
                        Días: {capacitacion.diasClase && capacitacion.diasClase.length > 0 
                          ? capacitacion.diasClase.map((d: any) => new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })).join(', ')
                          : `${new Date(capacitacion.fechaInicio).toLocaleDateString()} a ${new Date(capacitacion.fechaFin).toLocaleDateString()}`}
                      </div>
                      <div>Estado: <span style={{ color: stateColor }}>{stateText}</span></div>
                    </div>
                    
                    {miInscripcion ? (
                      <button onClick={() => setCursoSeleccionado(capacitacion)} className="primary-button" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', backgroundColor: 'var(--cruz-roja-red)', boxShadow: '0 4px 15px var(--red-glow)' }}>
                        VER CURSO
                      </button>
                    ) : isLleno ? (
                      <button onClick={() => setCursoSeleccionado(capacitacion)} className="secondary-button" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', border: '2px solid #e5e7eb', color: '#9ca3af' }}>
                        MÁS INFO
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleInscribirse(capacitacion.id)}
                        disabled={isPending}
                        className="primary-button" 
                        style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', opacity: isPending ? 0.7 : 1 }}
                      >
                        INSCRIBIRSE
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'ofertas' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {nuevasOfertas.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem', gridColumn: '1 / -1' }}>
                  No hay más ofertas por el momento.
                </div>
              ) : nuevasOfertas.map((capacitacion, index) => {
                const inscritos = capacitacion.inscripciones.length;
                const miInscripcion = capacitacion.inscripciones.find((i: any) => i.voluntarioId === voluntarioId);
                const color = Colors[(index + 3) % Colors.length];
                
                return (
                  <div key={capacitacion.id} style={{ backgroundColor: 'var(--surface-color)', borderRadius: '16px', padding: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: color, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: `0 4px 10px ${color}40` }}>
                      <BookOpen size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {capacitacion.titulo}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {capacitacion.descripcion || 'Sin descripción'}
                      </p>
                    </div>
                    {miInscripcion ? (
                      <span onClick={() => setCursoSeleccionado(capacitacion)} style={{ cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: '#007aff', padding: '0.4rem 0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,122,255,0.1)' }}>VER</span>
                    ) : (
                      <button 
                        onClick={() => handleInscribirse(capacitacion.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--cruz-roja-red)', fontWeight: 800, fontSize: '0.75rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}
                      >
                        INSCRIBIRSE
                      </button>
                    )}
                  </div>
                );
              })}
              </div>
          )}
          
        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* MI PROGRESO WIDGET */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,230,230,1) 100%)', 
            borderRadius: '24px', 
            padding: '2rem', 
            boxShadow: '0 10px 30px rgba(230, 0, 0, 0.15)',
            border: '1px solid rgba(255,255,255,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--cruz-roja-red)', opacity: 0.1, borderRadius: '50%', filter: 'blur(20px)' }}></div>
            
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', color: '#1f2937' }}>MI PROGRESO</h3>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', lineHeight: 1, marginBottom: '1rem' }}>
              {progresoGlobal}%
            </div>
            
            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '99px', marginBottom: '1rem' }}>
              <div style={{ width: `${progresoGlobal}%`, height: '100%', backgroundColor: 'var(--cruz-roja-red)', borderRadius: '99px' }}></div>
            </div>
            
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#4b5563', lineHeight: 1.4 }}>
              {cursosFinalizados.length} de {misCursos.length} cursos completados
            </p>
          </div>

          {/* NOTIFICACIONES WIDGET */}
          <div style={{ backgroundColor: 'var(--surface-color)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>NOTIFICACIONES</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
                  <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: 'var(--cruz-roja-red)', borderRadius: '50%' }}></div>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Nueva capacitación de Primeros Auxilios disponible.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Se han actualizado los requerimientos para tus turnos.
                </p>
              </div>
            </div>
          </div>
          
        </div>

      </div>

      <DetallesCursoModal 
        isOpen={!!cursoSeleccionado} 
        onClose={() => setCursoSeleccionado(null)} 
        curso={cursoSeleccionado} 
        voluntarioId={voluntarioId}
        onSalirCurso={handleCancelarInscripcion}
        isPending={isPending}
      />
    </div>
  );
}
