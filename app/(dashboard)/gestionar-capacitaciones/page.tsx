import React from 'react';
import { BookOpen, Users, CheckCircle } from 'lucide-react';
import { obtenerCapacitacionesAdmin } from '../../acciones/capacitaciones';
import GestorCapacitacionesClient from './GestorCapacitacionesClient';

export default async function GestionarCapacitacionesPage() {
  const capacitaciones = await obtenerCapacitacionesAdmin();
  
  const capacitacionesProgramadas = capacitaciones.filter(c => c.estado === 'Programada' || c.estado === 'En Curso').length;
  const totalInscripciones = capacitaciones.reduce((acc, c) => acc + c.inscripciones.length, 0);

  return (
    <div className="page-container page-capacitaciones-admin">
      <div className="dashboard-header-modern">
        <div>
          <h2>Gestión de Capacitaciones</h2>
          <p>Organiza eventos, cursos y controla la asistencia de los voluntarios</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--cruz-roja-red)', backgroundColor: 'rgba(230,0,0,0.1)' }}>
            <BookOpen size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Capacitaciones</h3>
            <p>{capacitaciones.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>Activas o Programadas</h3>
            <p>{capacitacionesProgramadas}</p>
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

      <GestorCapacitacionesClient capacitacionesIniciales={capacitaciones} />
    </div>
  );
}
