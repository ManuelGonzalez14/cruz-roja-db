import React from 'react';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { obtenerTurnosDisponibles } from '../../acciones/turnos';
import TurnosVoluntarioClient from './TurnosVoluntarioClient';

export default async function TurnosPage() {
  const turnos = await obtenerTurnosDisponibles();
  
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_cruz_roja')?.value;
  let voluntarioId = 0;

  if (sessionId) {
    const prisma = new PrismaClient();
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(sessionId) },
      include: { voluntario: true }
    });
    if (usuario && usuario.voluntario) {
      voluntarioId = usuario.voluntario.id;
    }
  }

  return (
    <TurnosVoluntarioClient 
      turnosIniciales={turnos} 
      voluntarioId={voluntarioId} 
    />
  );
}
