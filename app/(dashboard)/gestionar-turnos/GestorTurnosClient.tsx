'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Plus, Search, Edit2, Trash2, Users, Eye, EyeOff, UserCircle2 } from 'lucide-react';
import GestorTurnosModal from '../../components/GestorTurnosModal';
import { eliminarTurno } from '../../acciones/turnos';
import toast from 'react-hot-toast';

export default function GestorTurnosClient({ turnosIniciales }: { turnosIniciales: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [turnoEdit, setTurnoEdit] = useState<any>(null);
  const [turnos, setTurnos] = useState(turnosIniciales);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const handleOpenModal = (turno?: any) => {
    setTurnoEdit(turno || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTurnoEdit(null);
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
            ¿Estás seguro de que deseas eliminar este turno? Esta acción no se puede deshacer.
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
                  await eliminarTurno(id);
                  toast.success('Turno eliminado');
                } catch (error) {
                  toast.error('Error al eliminar turno');
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

  const filteredTurnos = turnosIniciales.filter(t => 
    t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.ubicacion && t.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Plus size={20} /> Nuevo Turno
        </button>
      </div>

      <div className="table-responsive">
        <table className="glass-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Título</th>
              <th style={{ padding: '1rem' }}>Fecha</th>
              <th style={{ padding: '1rem' }}>Ubicación</th>
              <th style={{ padding: '1rem' }}>Inscritos / Cupos</th>
              <th style={{ padding: '1rem' }}>Estado</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTurnos.map(turno => {
              const inscritos = turno.voluntariosInscritos.length;
              const isExpanded = expandedRowId === turno.id;
              
              return (
                <React.Fragment key={turno.id}>
                  <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--glass-border)', backgroundColor: isExpanded ? 'var(--glass-bg)' : 'transparent', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{turno.titulo}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {new Date(turno.fechaInicio).toLocaleDateString()} <br/>
                      <span style={{ fontSize: '0.85em' }}>
                        {new Date(turno.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(turno.fechaFin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{turno.ubicacion || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} />
                        {inscritos} / {turno.cuposMaximos}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`status-${turno.estado.toLowerCase()}`} style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'inline-block',
                        backgroundColor: turno.estado === 'Abierto' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                        color: turno.estado === 'Abierto' ? '#34c759' : '#ff3b30'
                      }}>
                        {turno.estado}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => toggleRow(turno.id)}
                        style={{ background: isExpanded ? 'rgba(0, 122, 255, 0.1)' : 'none', border: 'none', cursor: 'pointer', color: '#007aff', padding: '0.5rem', borderRadius: '8px', marginRight: '0.25rem', transition: 'background 0.2s' }}
                        title={isExpanded ? "Ocultar voluntarios" : "Ver voluntarios inscritos"}
                      >
                        {isExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        onClick={() => handleOpenModal(turno)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem' }}
                        title="Editar turno"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(turno.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cruz-roja-red)', padding: '0.5rem' }}
                        title="Eliminar turno"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}>
                      <td colSpan={6} style={{ padding: '0 2rem 2rem 2rem' }}>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
                          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={18} /> Voluntarios Inscritos
                          </h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {turno.voluntariosInscritos.length === 0 ? (
                              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0, padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                                Aún no hay voluntarios inscritos en este turno.
                              </p>
                            ) : (
                              turno.voluntariosInscritos.map((inscripcion: any) => (
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
                                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34c759', display: 'inline-block', fontWeight: 500 }}>
                                      {inscripcion.estado}
                                    </span>
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
            {filteredTurnos.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No se encontraron turnos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <GestorTurnosModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        turnoEdit={turnoEdit} 
      />
    </div>
  );
}
