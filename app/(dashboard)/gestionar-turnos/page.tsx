import React from 'react';
import { Plus, Search, Calendar, Users, CheckCircle } from 'lucide-react';
import { obtenerTurnosAdmin } from '../../acciones/turnos';
import GestorTurnosClient from './GestorTurnosClient';

export default async function GestionarTurnosPage() {
  const turnos = await obtenerTurnosAdmin();
  
  const turnosAbiertos = turnos.filter((t: any) => t.estado === 'Abierto').length;
  const totalInscripciones = turnos.reduce((acc: number, t: any) => acc + t.voluntariosInscritos.length, 0);

  return (
    <div className="page-container page-turnos-admin">
      <div className="dashboard-header-modern">
        <div>
          <h2>Gestión de Turnos</h2>
          <p>Administra los horarios y asignaciones de los voluntarios</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--cruz-roja-red)', backgroundColor: 'rgba(230,0,0,0.1)' }}>
            <Calendar size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Turnos</h3>
            <p>{turnos.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>Turnos Abiertos</h3>
            <p>{turnosAbiertos}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Users size={28} />
          </div>
          <div className="stat-info">
            <h3>Voluntarios Inscritos</h3>
            <p>{totalInscripciones}</p>
          </div>
        </div>
      </div>

      <GestorTurnosClient turnosIniciales={turnos} />
    </div>
  );
}
