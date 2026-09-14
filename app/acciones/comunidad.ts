"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const prisma = new PrismaClient() as any;

export async function obtenerNoticias() {
  try {
    const noticias = await prisma.noticia.findMany({
      orderBy: { creadoEn: 'desc' },
      include: { autor: { select: { email: true } } }
    });
    return noticias;
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    return [];
  }
}

export async function crearNoticia(formData: FormData) {
  try {
    const titulo = formData.get('titulo') as string;
    const contenido = formData.get('contenido') as string;
    const categoria = formData.get('categoria') as string;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_cruz_roja')?.value;
    
    if (!sessionId) return { success: false, error: 'No autorizado' };

    await prisma.noticia.create({
      data: {
        titulo,
        contenido,
        categoria,
        autorId: parseInt(sessionId)
      }
    });

    revalidatePath('/noticias');
    revalidatePath('/gestionar-comunidad');
    return { success: true };
  } catch (error: any) {
    console.error("Error al crear noticia:", error);
    return { success: false, error: error.message };
  }
}

export async function eliminarNoticia(id: number) {
  try {
    await prisma.noticia.delete({ where: { id } });
    revalidatePath('/noticias');
    revalidatePath('/gestionar-comunidad');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
