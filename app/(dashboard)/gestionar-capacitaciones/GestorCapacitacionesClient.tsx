'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Plus, Search, Edit2, Trash2, Users, Eye, EyeOff, UserCircle2, BookOpen } from 'lucide-react';
import GestorCapacitacionesModal from '../../components/GestorCapacitacionesModal';
import { eliminarCapacitacion, actualizarAsistencia } from '../../acciones/capacitaciones';
import toast from 'react-hot-toast';

export default function GestorCapacitacionesClient({ capacitacionesIniciales }: { capacitacionesIniciales: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capacitacionEdit, setCapacitacionEdit] = useState<any>(null);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const handleOpenModal = (capacitacion?: any) => {
    setCapacitacionEdit(capacitacion || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCapacitacionEdit(null);
  };

  const toggleRow = (id: number) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
    }
  };

  const handleDelete = (id: number) => {
    toast((t) => (
      <>
        {typeof document !== 'undefined' && ReactDOM.createPortal(
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(5px)',
            zIndex: 9998
          }} />,
          document.body
        )}
        <div style={{ padding: '0.5rem', position: 'relative', zIndex: 9999 }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Confirmar Eliminación
          </h4>
          <p style={{ margin: '0 0 1rem 0', color: '#4b5563', fontSize: '0.95rem' }}>
            ¿Estás seguro de que deseas eliminar esta capacitación? Esta acción no se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => toast.dismiss(t.id)} 
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer', fontWeight: 500, color: '#374151' }}
            >
              Cancelar
            </button>
            <button 
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await eliminarCapacitacion(id);
                  if (res.success) {
                    toast.success('Capacitación eliminada');
                  } else {
                    toast.error(res.error || 'Error al eliminar capacitación');
                  }
                } catch (error) {
                  toast.error('Error al eliminar capacitación');
                }
              }}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 500 }}
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </>
    ), { duration: Infinity });
  };

  const handleEstadoChange = async (capacitacionId: number, voluntarioId: number, nuevoEstado: string) => {
    const loadingToast = toast.loading('Actualizando estado...');
    try {
      const res = await actualizarAsistencia(capacitacionId, voluntarioId, nuevoEstado);
      if (res.success) {
        toast.success('Estado actualizado', { id: loadingToast });
      } else {
        toast.error(res.error || 'Error al actualizar', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Error al actualizar estado', { id: loadingToast });
    }
  };

  const filteredCapacitaciones = capacitacionesIniciales.filter(c => 
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.ubicacion && c.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: '1', minWidth: '250px', maxWidth: '400px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <Search size={20} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Buscar por título o ubicación..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', width: '100%', outline: 'none' }}
          />
        </div>
        
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-solid-red"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> Nueva Capacitación
        </button>
      </div>

      <div className="table-responsive">
        <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Título</th>
              <th style={{ padding: '1rem' }}>Fecha</th>
              <th style={{ padding: '1rem' }}>Ubicación e Instructor</th>
              <th style={{ padding: '1rem' }}>Inscritos / Cupos</th>
              <th style={{ padding: '1rem' }}>Estado</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCapacitaciones.map(capacitacion => {
              const inscritos = capacitacion.inscripciones.length;
              const isExpanded = expandedRowId === capacitacion.id;
              
              return (
                <React.Fragment key={capacitacion.id}>
                  <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--glass-border)', backgroundColor: isExpanded ? 'var(--glass-bg)' : 'transparent', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={18} style={{ color: 'var(--text-secondary)' }} />
                        {capacitacion.titulo}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {capacitacion.diasClase && capacitacion.diasClase.length > 0 
                        ? capacitacion.diasClase.map((d: any) => new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })).join(', ')
                        : `${new Date(capacitacion.fechaInicio).toLocaleDateString()} a ${new Date(capacitacion.fechaFin).toLocaleDateString()}`} <br/>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        {capacitacion.horaInicio} - {capacitacion.horaFin}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {capacitacion.ubicacion || '-'}
                      {capacitacion.instructor && (
                        <div style={{ fontSize: '0.85em', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                          Instructor: {capacitacion.instructor}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} />
                        {inscritos} / {capacitacion.cuposMaximos}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`status-${capacitacion.estado.replace(' ', '-').toLowerCase()}`} style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'inline-block',
                        backgroundColor: capacitacion.estado === 'Programada' ? 'rgba(0, 122, 255, 0.1)' : 
                                         capacitacion.estado === 'En Curso' ? 'rgba(255, 149, 0, 0.1)' :
                                         capacitacion.estado === 'Finalizada' ? 'rgba(52, 199, 89, 0.1)' :
                                         'rgba(255, 59, 48, 0.1)',
                        color: capacitacion.estado === 'Programada' ? '#007aff' : 
                               capacitacion.estado === 'En Curso' ? '#ff9500' :
                               capacitacion.estado === 'Finalizada' ? '#34c759' :
                               '#ff3b30'
                      }}>
                        {capacitacion.estado}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => toggleRow(capacitacion.id)}
                        style={{ background: isExpanded ? 'rgba(0, 122, 255, 0.1)' : 'none', border: 'none', cursor: 'pointer', color: '#007aff', padding: '0.5rem', borderRadius: '8px', marginRight: '0.25rem', transition: 'background 0.2s' }}
                        title={isExpanded ? "Ocultar voluntarios" : "Ver asistencia e inscritos"}
                      >
                        {isExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        onClick={() => handleOpenModal(capacitacion)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem' }}
                        title="Editar capacitación"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(capacitacion.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cruz-roja-red)', padding: '0.5rem' }}
                        title="Eliminar capacitación"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}>
                      <td colSpan={6} style={{ padding: '0 2rem 2rem 2rem' }}>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
                          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Users size={18} /> Control de Asistencia e Inscripciones
                            </div>
                          </h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                            {capacitacion.inscripciones.length === 0 ? (
                              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0, padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                                Aún no hay voluntarios inscritos en esta capacitación.
                              </p>
                            ) : (
                              capacitacion.inscripciones.map((inscripcion: any) => (
                                <div key={inscripcion.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(230,0,0,0.1)', color: 'var(--cruz-roja-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <UserCircle2 size={24} />
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {inscripcion.voluntario?.nombre} {inscripcion.voluntario?.apellido}
                                    </h5>
                                    <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginTop: '2px' }}>
                                      Cédula: {inscripcion.voluntario?.cedula || 'N/A'} {inscripcion.voluntario?.numeroCarnet ? `| Carnet: ${inscripcion.voluntario?.numeroCarnet}` : ''}
                                    </span>
                                  </div>
                                  <div style={{ flexShrink: 0 }}>
                                    <select 
                                      value={inscripcion.estado}
                                      onChange={(e) => handleEstadoChange(capacitacion.id, inscripcion.voluntarioId, e.target.value)}
                                      style={{
                                        fontSize: '0.85rem',
                                        padding: '0.3rem 0.5rem',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        backgroundColor: '#fff',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        color: inscripcion.estado === 'Asistió' ? '#34c759' :
                                               inscripcion.estado === 'Aprobó' ? '#007aff' :
                                               inscripcion.estado === 'No Asistió' || inscripcion.estado === 'Reprobó' ? '#ff3b30' :
                                               '#374151'
                                      }}
                                    >
                                      <option value="Inscrito">Inscrito</option>
                                      <option value="Asistió">Asistió</option>
                                      <option value="No Asistió">No Asistió</option>
                                      <option value="Aprobó">Aprobó</option>
                                      <option value="Reprobó">Reprobó</option>
                                    </select>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
            {filteredCapacitaciones.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No se encontraron capacitaciones programadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <GestorCapacitacionesModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        capacitacionEdit={capacitacionEdit} 
      />
    </div>
  );
}
