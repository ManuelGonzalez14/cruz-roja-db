import React from 'react';
import { getAmbulancias } from '../../acciones/ambulancias';
import AmbulanceDashboard from '../../components/AmbulanceDashboard';

export default async function AmbulanciasPage() {
  const ambulanciasRaw = await getAmbulancias();
  
  // Serializar para pasar al Client Component
  const ambulancias = JSON.parse(JSON.stringify(ambulanciasRaw));

  return (
    <div className="page-container" style={{ padding: '2rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Flota de Ambulancias
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Gestiona los vehículos operativos y su inventario de insumos interno.
          </p>
        </div>
      </header>

      <AmbulanceDashboard initialAmbulancias={ambulancias} />
    </div>
  );
}
