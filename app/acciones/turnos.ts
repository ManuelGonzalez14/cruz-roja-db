'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function obtenerTurnosAdmin() {
  try {
    const turnos = await prisma.turno.findMany({
      include: {
        voluntariosInscritos: {
          include: {
            voluntario: true
          }
        }
      },
      orderBy: {
        fechaInicio: 'desc'
      }
    });
    return turnos;
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    throw new Error('No se pudieron obtener los turnos');
  }
}

export async function crearTurno(data: {
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion?: string;
  habilidadesRequeridas?: string;
  cuposMaximos: number;
  estado?: string;
}) {
  try {
    const turno = await prisma.turno.create({
      data
    });
    revalidatePath('/gestionar-turnos');
    return turno;
  } catch (error) {
    console.error('Error al crear turno:', error);
    throw new Error('No se pudo crear el turno');
  }
}

export async function actualizarTurno(id: number, data: {
  titulo?: string;
  descripcion?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  ubicacion?: string;
  habilidadesRequeridas?: string;
  cuposMaximos?: number;
  estado?: string;
}) {
  try {
    const turno = await prisma.turno.update({
      where: { id },
      data
    });
    revalidatePath('/gestionar-turnos');
    return turno;
  } catch (error) {
    console.error('Error al actualizar turno:', error);
    throw new Error('No se pudo actualizar el turno');
  }
}

export async function eliminarTurno(id: number) {
  try {
    await prisma.turno.delete({
      where: { id }
    });
    revalidatePath('/gestionar-turnos');
    return true;
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    throw new Error('No se pudo eliminar el turno');
  }
}

export async function obtenerTurnosDisponibles() {
  try {
    const turnos = await prisma.turno.findMany({
      where: {
        estado: 'Abierto',
        // Optional: solo turnos futuros
        // fechaInicio: { gte: new Date() }
      },
      include: {
        voluntariosInscritos: true
      },
      orderBy: {
        fechaInicio: 'asc'
      }
    });
    return turnos;
  } catch (error) {
    console.error('Error al obtener turnos disponibles:', error);
    throw new Error('No se pudieron obtener los turnos disponibles');
  }
}

export async function inscribirseEnTurno(turnoId: number, voluntarioId: number) {
  try {
    const turno = await prisma.turno.findUnique({
      where: { id: turnoId },
      include: { voluntariosInscritos: true }
    });

    if (!turno) throw new Error('Turno no encontrado');
    if (turno.voluntariosInscritos.length >= turno.cuposMaximos) {
      throw new Error('El turno ya no tiene cupos disponibles');
    }

    const inscripcion = await prisma.turnoVoluntario.create({
      data: {
        turnoId,
        voluntarioId
      }
    });
    revalidatePath('/turnos');
    return inscripcion;
  } catch (error: any) {
    console.error('Error al inscribirse en turno:', error);
    throw new Error(error.message || 'No se pudo inscribir en el turno');
  }
}

export async function cancelarInscripcionTurno(turnoId: number, voluntarioId: number) {
  try {
    await prisma.turnoVoluntario.delete({
      where: {
        turnoId_voluntarioId: {
          turnoId,
          voluntarioId
        }
      }
    });
    revalidatePath('/turnos');
    return true;
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    throw new Error('No se pudo cancelar la inscripción');
  }
}
