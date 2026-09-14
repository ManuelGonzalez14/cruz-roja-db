'use client';

import React, { useState, useTransition } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';
import { agregarAmbulancia, guardarInsumo, ajustarCantidadInsumo, editarAmbulancia, eliminarAmbulancia } from '../acciones/ambulancias';
import CustomSelect from './CustomSelect';

export default function AmbulanceDashboard({ initialAmbulancias }: { initialAmbulancias: any[] }) {
  const [ambulancias, setAmbulancias] = useState(initialAmbulancias);
  const [selectedAmbulance, setSelectedAmbulance] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [showAddAmbulance, setShowAddAmbulance] = useState(false);
  const [showEditAmbulance, setShowEditAmbulance] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<any | null>(null);
  const [showAddInsumo, setShowAddInsumo] = useState(false);

  // Funciones de actualización
  const handleAddAmbulance = async (formData: FormData) => {
    startTransition(async () => {
      const res = await agregarAmbulancia(formData);
      if (!res.error) {
        setShowAddAmbulance(false);
        toast.success('Ambulancia agregada');
        window.location.reload(); // Quick refresh for demo
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleEditAmbulance = async (formData: FormData) => {
    formData.append('id', editingAmbulance.id.toString());
    startTransition(async () => {
      const res = await editarAmbulancia(formData);
      if (!res.error) {
        setShowEditAmbulance(false);
        toast.success('Ambulancia actualizada');
        window.location.reload();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDeleteAmbulance = (id: number, placa: string) => {
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
            ¿Estás seguro de eliminar la ambulancia {placa} y todo su inventario?
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
                startTransition(async () => {
                  const res = await eliminarAmbulancia(id);
                  if (!res.error) {
                    if (selectedAmbulance?.id === id) setSelectedAmbulance(null);
                    toast.success('Ambulancia eliminada');
                    window.location.reload();
                  } else {
                    toast.error(res.error);
                  }
                });
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

  const handleAddInsumo = async (formData: FormData) => {
    formData.append('ambulanciaId', selectedAmbulance.id.toString());
    startTransition(async () => {
      const res = await guardarInsumo(formData);
      if (!res.error) {
        setShowAddInsumo(false);
        toast.success('Insumo agregado');
        window.location.reload();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleAjustar = async (insumoId: number, current: number, delta: number) => {
    const newVal = current + delta;
    if (newVal < 0) return;
    
    // Optimistic UI update
    const updatedAmbulancias = ambulancias.map(a => {
      if (a.id === selectedAmbulance.id) {
        return {
          ...a,
          insumos: a.insumos.map((i: any) => i.id === insumoId ? { ...i, cantidad: newVal } : i)
        };
      }
      return a;
    });
    setAmbulancias(updatedAmbulancias);
    setSelectedAmbulance(updatedAmbulancias.find(a => a.id === selectedAmbulance.id));

    startTransition(async () => {
      await ajustarCantidadInsumo(insumoId, newVal);
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
      
      {/* Columna Izquierda: Lista de Ambulancias */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={() => setShowAddAmbulance(true)}
          className="form-button"
          style={{ background: 'var(--cruz-roja-red)', border: 'none', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span> Agregar Ambulancia
        </button>

        {ambulancias.map(amb => (
          <div 
            key={amb.id} 
            onClick={() => setSelectedAmbulance(amb)}
            className={`ambulance-card ${selectedAmbulance?.id === amb.id ? 'selected' : ''}`}
            style={{ 
              padding: '1.5rem', 
              borderRadius: '16px', 
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{amb.placa}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span 
                  onClick={(e) => { e.stopPropagation(); setEditingAmbulance(amb); setShowEditAmbulance(true); }}
                  style={{ cursor: 'pointer', fontSize: '1rem' }} 
                  title="Editar"
                >✏️</span>
                <span 
                  onClick={(e) => { e.stopPropagation(); handleDeleteAmbulance(amb.id, amb.placa); }}
                  style={{ cursor: 'pointer', fontSize: '1rem' }} 
                  title="Eliminar"
                >🗑️</span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>{amb.modelo || 'Sin Modelo Especificado'}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: amb.estado === 'Operativa' ? (selectedAmbulance?.id === amb.id ? 'rgba(255,255,255,0.2)' : 'rgba(16, 185, 129, 0.1)') : 'rgba(239, 68, 68, 0.1)', color: amb.estado === 'Operativa' ? (selectedAmbulance?.id === amb.id ? 'white' : '#10b981') : '#ef4444' }}>
                {amb.estado}
              </div>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>🚑</span>
            </div>
          </div>
        ))}
      </div>

      {/* Columna Derecha: Inventario */}
      <div className="ambulance-details" style={{ borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', minHeight: '500px' }}>
        {selectedAmbulance ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  Inventario: Ambulancia {selectedAmbulance.placa}
                </h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Gestiona los insumos, equipos y materiales médicos a bordo.</p>
              </div>
              <button 
                onClick={() => setShowAddInsumo(true)}
                className="btn-icon" 
                style={{ background: 'var(--bg-color-alt)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                + Añadir Insumo
              </button>
            </div>

            {selectedAmbulance.insumos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📦</div>
                <p>El inventario de esta ambulancia está vacío.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Insumo</th>
                      <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Cantidad</th>
                      <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '2px solid var(--border-color)' }}>Ajustar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAmbulance.insumos.map((insumo: any) => (
                      <tr key={insumo.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{insumo.nombre}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{insumo.categoria || 'General'}</div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', minWidth: '40px', fontWeight: 800, fontSize: '1.1rem', color: insumo.cantidad < 5 ? '#ef4444' : 'var(--text-primary)' }}>
                            {insumo.cantidad}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleAjustar(insumo.id, insumo.cantidad, -1)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 800, color: 'var(--text-secondary)' }}
                            >-</button>
                            <button 
                              onClick={() => handleAjustar(insumo.id, insumo.cantidad, 1)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color-alt)', cursor: 'pointer', fontWeight: 800, color: 'var(--text-primary)' }}
                            >+</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>🚑</div>
            <p>Selecciona una ambulancia para ver su inventario</p>
          </div>
        )}
      </div>

      {/* Modal: Agregar Ambulancia */}
      {showAddAmbulance && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>Registrar Ambulancia</h3>
            <form action={handleAddAmbulance}>
              <div className="form-group">
                <label className="form-label">Placa / Identificador</label>
                <input type="text" name="placa" className="form-input" required placeholder="AMB-01" />
              </div>
              <div className="form-group">
                <label className="form-label">Modelo (Opcional)</label>
                <input type="text" name="modelo" className="form-input" placeholder="Ford Transit 2022" />
              </div>
              <div className="form-group">
                <label className="form-label">Estado Inicial</label>
                <CustomSelect
                  name="estado"
                  options={[
                    { value: 'Operativa', label: 'Operativa' },
                    { value: 'En Taller', label: 'En Taller' },
                    { value: 'Fuera de Servicio', label: 'Fuera de Servicio' }
                  ]}
                  value="Operativa"
                  placeholder="Seleccione estado..."
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowAddAmbulance(false)} className="form-button" style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>Cancelar</button>
                <button type="submit" className="form-button" disabled={isPending}>{isPending ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Ambulancia */}
      {showEditAmbulance && editingAmbulance && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>Editar Ambulancia</h3>
            <form action={handleEditAmbulance}>
              <div className="form-group">
                <label className="form-label">Placa / Identificador</label>
                <input type="text" name="placa" className="form-input" required defaultValue={editingAmbulance.placa} />
              </div>
              <div className="form-group">
                <label className="form-label">Modelo (Opcional)</label>
                <input type="text" name="modelo" className="form-input" defaultValue={editingAmbulance.modelo || ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <CustomSelect
                  name="estado"
                  options={[
                    { value: 'Operativa', label: 'Operativa' },
                    { value: 'En Taller', label: 'En Taller' },
                    { value: 'Fuera de Servicio', label: 'Fuera de Servicio' }
                  ]}
                  value={editingAmbulance.estado}
                  placeholder="Seleccione estado..."
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowEditAmbulance(false)} className="form-button" style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>Cancelar</button>
                <button type="submit" className="form-button" disabled={isPending}>{isPending ? 'Guardando...' : 'Guardar Cambios'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar Insumo */}
      {showAddInsumo && selectedAmbulance && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>Añadir Insumo a {selectedAmbulance.placa}</h3>
            <form action={handleAddInsumo}>
              <div className="form-group">
                <label className="form-label">Nombre del Insumo / Equipo</label>
                <input type="text" name="nombre" className="form-input" required placeholder="Gazas Estériles" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cantidad Inicial</label>
                  <input type="number" name="cantidad" className="form-input" required min="0" defaultValue="1" />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <CustomSelect
                    name="categoria"
                    options={[
                      { value: 'Material Gastable', label: 'Material Gastable' },
                      { value: 'Medicamentos', label: 'Medicamentos' },
                      { value: 'Equipos', label: 'Equipos Médicos' },
                      { value: 'Herramientas', label: 'Herramientas' }
                    ]}
                    value="Material Gastable"
                    placeholder="Seleccione categoría..."
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowAddInsumo(false)} className="form-button" style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>Cancelar</button>
                <button type="submit" className="form-button" disabled={isPending}>{isPending ? 'Guardando...' : 'Añadir'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
