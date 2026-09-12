"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function obtenerMejoras() {
  try {
    const mejoras = await prisma.mejora.findMany({
      orderBy: { creadoEn: 'desc' }
    });
    return { success: true, mejoras };
  } catch (error: any) {
    return { success: false, error: 'Error al obtener las mejoras' };
  }
}

export async function crearMejora(formData: FormData) {
  try {
    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;

    if (!titulo || titulo.trim() === '') {
      return { success: false, error: 'El título es obligatorio' };
    }

    const mejora = await prisma.mejora.create({
      data: {
        titulo: titulo.trim(),
        descripcion: descripcion ? descripcion.trim() : null,
        estado: 'Pendiente'
      }
    });

    revalidatePath('/mejoras');
    return { success: true, mejora };
  } catch (error: any) {
    return { success: false, error: 'Error al crear la mejora' };
  }
}

export async function actualizarEstadoMejora(id: number, estado: string) {
  try {
    const mejora = await prisma.mejora.update({
      where: { id },
      data: { estado }
    });

    revalidatePath('/mejoras');
    return { success: true, mejora };
  } catch (error: any) {
    return { success: false, error: 'Error al actualizar el estado' };
  }
}

export async function eliminarMejora(id: number) {
  try {
    await prisma.mejora.delete({
      where: { id }
    });

    revalidatePath('/mejoras');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Error al eliminar la mejora' };
  }
}
