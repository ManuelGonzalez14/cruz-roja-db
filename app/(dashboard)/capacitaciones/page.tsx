import React from 'react';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { obtenerCapacitacionesDisponibles } from '../../acciones/capacitaciones';
import CapacitacionesVoluntarioClient from './CapacitacionesVoluntarioClient';

export default async function CapacitacionesPage() {
  const capacitaciones = await obtenerCapacitacionesDisponibles();
  
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_cruz_roja')?.value;
  let voluntarioId = 0;
  let usuarioAutenticado = null;

  if (sessionId) {
    const prisma = new PrismaClient();
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(sessionId) },
      include: { voluntario: true }
    });
    if (usuario && usuario.voluntario) {
      voluntarioId = usuario.voluntario.id;
      usuarioAutenticado = usuario.voluntario;
    }
  }

  return (
    <div className="page-container page-capacitaciones" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
      <CapacitacionesVoluntarioClient 
        capacitacionesIniciales={capacitaciones} 
        voluntarioId={voluntarioId} 
        nombreVoluntario={usuarioAutenticado ? usuarioAutenticado.nombre : ''}
      />
    </div>
  );
}
