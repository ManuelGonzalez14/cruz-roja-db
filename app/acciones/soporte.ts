"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const prisma = new PrismaClient() as any;

export async function obtenerTickets() {
  try {
    const tickets = await prisma.ticketSoporte.findMany({
      orderBy: { creadoEn: 'desc' },
      include: { voluntario: true }
    });
    return tickets;
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    return [];
  }
}

export async function obtenerMisTickets() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_cruz_roja')?.value;
    if (!sessionId) return [];

    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(sessionId) }
    });

    if (!usuario?.voluntarioId) return [];

    const tickets = await prisma.ticketSoporte.findMany({
      where: { voluntarioId: usuario.voluntarioId },
      orderBy: { creadoEn: 'desc' }
    });
    return tickets;
  } catch (error) {
    console.error("Error al obtener mis tickets:", error);
    return [];
  }
}

export async function crearTicket(formData: FormData) {
  try {
    const asunto = formData.get('asunto') as string;
    const descripcion = formData.get('descripcion') as string;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_cruz_roja')?.value;
    
    if (!sessionId) return { success: false, error: 'No autorizado' };

    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(sessionId) }
    });

    if (!usuario?.voluntarioId) {
      return { success: false, error: 'Perfil de voluntario no vinculado' };
    }

    await prisma.ticketSoporte.create({
      data: {
        asunto,
        descripcion,
        voluntarioId: usuario.voluntarioId
      }
    });

    revalidatePath('/soporte');
    revalidatePath('/gestionar-soporte');
    return { success: true };
  } catch (error: any) {
    console.error("Error al crear ticket:", error);
    return { success: false, error: error.message };
  }
}

export async function responderTicket(id: number, respuesta: string) {
  try {
    await prisma.ticketSoporte.update({
      where: { id },
      data: {
        respuesta,
        estado: 'Resuelto'
      }
    });

    revalidatePath('/soporte');
    revalidatePath('/gestionar-soporte');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
