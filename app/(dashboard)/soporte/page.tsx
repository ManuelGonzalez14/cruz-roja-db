import React from 'react';
import { obtenerMisTickets } from '../../acciones/soporte';
import SoporteClient from './SoporteClient';

export default async function SoportePage() {
  const misTickets = await obtenerMisTickets();

  return (
    <div className="page-container page-soporte">
      <div className="soporte-header">
        <h2>Centro de Ayuda y Soporte al Voluntario</h2>
        <p>Abre un ticket si tienes problemas técnicos o dudas sobre tu voluntariado</p>
      </div>
      
      <SoporteClient ticketsIniciales={misTickets} />
    </div>
  );
}

