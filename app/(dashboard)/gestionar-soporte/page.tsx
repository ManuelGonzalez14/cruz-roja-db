import React from 'react';
import { obtenerTickets } from '../../acciones/soporte';
import GestorSoporteClient from './GestorSoporteClient';

export default async function GestionarSoportePage() {
  const tickets = await obtenerTickets();

  return (
    <div className="page-container page-soporte-admin">
      <div className="page-header">
        <div>
          <h2>Centro de Soporte Técnico</h2>
          <p>Gestiona y responde a los problemas reportados por los voluntarios</p>
        </div>
      </div>
      
      <GestorSoporteClient ticketsIniciales={tickets} />
    </div>
  );
}

