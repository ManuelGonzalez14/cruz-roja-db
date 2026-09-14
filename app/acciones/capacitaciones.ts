'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function obtenerCapacitacionesAdmin() {
  try {
    const capacitaciones = await prisma.capacitacion.findMany({
      include: {
        inscripciones: {
          include: {
            voluntario: true
          }
        }
      },
      orderBy: {
        fechaInicio: 'desc'
      }
    });
    return capacitaciones;
  } catch (error) {
    console.error('Error al obtener capacitaciones:', error);
    throw new Error('No se pudieron obtener las capacitaciones');
  }
}

export async function crearCapacitacion(data: {
  titulo: string;
  descripcion?: string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  horaInicio?: string;
  horaFin?: string;
  diasClase?: (Date | string)[];
  ubicacion?: string;
  instructor?: string;
  cuposMaximos: number;
  estado?: string;
}) {
  try {
    const dataToSave: any = { ...data };
    dataToSave.fechaInicio = new Date(data.fechaInicio);
    dataToSave.fechaFin = new Date(data.fechaFin);
    if (data.diasClase) {
      dataToSave.diasClase = data.diasClase.map(d => new Date(d));
    }

    const capacitacion = await prisma.capacitacion.create({
      data: dataToSave
    });
    revalidatePath('/gestionar-capacitaciones');
    return { success: true, data: capacitacion };
  } catch (error) {
    console.error('Error al crear capacitacion:', error);
    return { success: false, error: 'No se pudo crear la capacitación' };
  }
}

export async function actualizarCapacitacion(id: number, data: {
  titulo?: string;
  descripcion?: string;
  fechaInicio?: Date | string;
  fechaFin?: Date | string;
  horaInicio?: string;
  horaFin?: string;
  diasClase?: (Date | string)[];
  ubicacion?: string;
  instructor?: string;
  cuposMaximos?: number;
  estado?: string;
}) {
  try {
    const dataToSave: any = { ...data };
    if (data.fechaInicio) dataToSave.fechaInicio = new Date(data.fechaInicio);
    if (data.fechaFin) dataToSave.fechaFin = new Date(data.fechaFin);
    if (data.diasClase) {
      dataToSave.diasClase = data.diasClase.map(d => new Date(d));
    }

    const capacitacion = await prisma.capacitacion.update({
      where: { id },
      data: dataToSave
    });
    revalidatePath('/gestionar-capacitaciones');
    return { success: true, data: capacitacion };
  } catch (error) {
    console.error('Error al actualizar capacitacion:', error);
    return { success: false, error: 'No se pudo actualizar la capacitación' };
  }
}

export async function eliminarCapacitacion(id: number) {
  try {
    await prisma.capacitacion.delete({
      where: { id }
    });
    revalidatePath('/gestionar-capacitaciones');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar capacitacion:', error);
    return { success: false, error: 'No se pudo eliminar la capacitación' };
  }
}

export async function obtenerCapacitacionesDisponibles() {
  try {
    const capacitaciones = await prisma.capacitacion.findMany({
      where: {
        estado: { in: ['Programada', 'En Curso'] },
      },
      include: {
        inscripciones: true
      },
      orderBy: {
        fechaInicio: 'asc'
      }
    });
    return capacitaciones;
  } catch (error) {
    console.error('Error al obtener capacitaciones disponibles:', error);
    throw new Error('No se pudieron obtener las capacitaciones disponibles');
  }
}

export async function inscribirseEnCapacitacion(capacitacionId: number, voluntarioId: number) {
  try {
    const capacitacion = await prisma.capacitacion.findUnique({
      where: { id: capacitacionId },
      include: { inscripciones: true }
    });

    if (!capacitacion) return { success: false, error: 'Capacitación no encontrada' };
    if (capacitacion.inscripciones.length >= capacitacion.cuposMaximos) {
      return { success: false, error: 'La capacitación ya no tiene cupos disponibles' };
    }

    const inscripcion = await prisma.capacitacionInscripcion.create({
      data: {
        capacitacionId,
        voluntarioId
      }
    });
    revalidatePath('/capacitaciones');
    return { success: true, data: inscripcion };
  } catch (error: any) {
    console.error('Error al inscribirse en capacitacion:', error);
    return { success: false, error: error.message || 'No se pudo inscribir en la capacitación' };
  }
}

export async function cancelarInscripcionCapacitacion(capacitacionId: number, voluntarioId: number) {
  try {
    await prisma.capacitacionInscripcion.delete({
      where: {
        capacitacionId_voluntarioId: {
          capacitacionId,
          voluntarioId
        }
      }
    });
    revalidatePath('/capacitaciones');
    return { success: true };
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    return { success: false, error: 'No se pudo cancelar la inscripción' };
  }
}

export async function actualizarAsistencia(capacitacionId: number, voluntarioId: number, estado: string) {
  try {
    const inscripcion = await prisma.capacitacionInscripcion.update({
      where: {
        capacitacionId_voluntarioId: {
          capacitacionId,
          voluntarioId
        }
      },
      data: { estado }
    });
    revalidatePath('/gestionar-capacitaciones');
    return { success: true, data: inscripcion };
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    return { success: false, error: 'No se pudo actualizar la asistencia' };
  }
}
