"use server";

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const prisma = new PrismaClient();
// Inicializamos el cliente de Supabase de forma segura
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase no está configurado');
  }
  return createClient(supabaseUrl, supabaseKey);
}

const cursoSchema = z.object({
  nombre: z.string().min(2, "El nombre del curso es muy corto"),
  institucion: z.string().min(2, "El nombre de la institución es muy corto"),
  voluntarioId: z.number()
});

export async function agregarCurso(formData: FormData) {
  try {
    const voluntarioIdStr = formData.get('voluntarioId');
    if (!voluntarioIdStr) return { success: false, error: 'Falta el ID del voluntario' };
    
    const voluntarioId = parseInt(voluntarioIdStr as string, 10);

    const rawData = {
      nombre: formData.get('nombre') as string,
      institucion: formData.get('institucion') as string || 'Cruz Roja',
      voluntarioId
    };

    const validatedFields = cursoSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error?.issues[0]?.message || 'Datos inválidos' };
    }

    const { nombre, institucion } = validatedFields.data;
    const diploma = formData.get('diploma') as File | null;

    let diplomaUrl = null;

    // Subir el diploma a Supabase si existe
    if (diploma && diploma.size > 0) {
      const extension = diploma.name.split('.').pop();
      const nombreArchivo = `diploma-${voluntarioId}-${Date.now()}.${extension}`;
      
      const arrayBuffer = await diploma.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let supabase;
      try {
        supabase = getSupabase();
      } catch (e) {
        return { success: false, error: 'Faltan credenciales de Supabase en el servidor' };
      }

      const { data, error } = await supabase
        .storage
        .from('voluntarios') // Reutilizamos el mismo bucket para simplificar
        .upload(`diplomas/${nombreArchivo}`, buffer, {
          contentType: diploma.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error al subir diploma:', error);
        return { success: false, error: `Error al subir imagen: ${error.message}` };
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('voluntarios')
        .getPublicUrl(`diplomas/${nombreArchivo}`);

      diplomaUrl = publicUrlData.publicUrl;
    }

    await prisma.curso.create({
      data: {
        nombre,
        institucion,
        diplomaUrl,
        voluntarioId
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error al agregar curso:', error);
    return { success: false, error: 'Error interno del servidor al guardar el curso' };
  }
}

export async function eliminarCurso(cursoId: number) {
  try {
    const curso = await prisma.curso.findUnique({ where: { id: cursoId } });
    if (!curso) return { success: false, error: 'Curso no encontrado' };

    // Si tiene diploma, lo borramos de Supabase
    if (curso.diplomaUrl) {
      const parts = curso.diplomaUrl.split('/voluntarios/');
      if (parts.length === 2) {
        const pathInBucket = parts[1]; // ej: 'diplomas/archivo.jpg'
        if (pathInBucket) {
          try {
            const supabase = getSupabase();
            await supabase.storage.from('voluntarios').remove([pathInBucket]);
          } catch (e) {
            console.error("Error al borrar diploma en Supabase:", e);
          }
        }
      }
    }

    await prisma.curso.delete({ where: { id: cursoId } });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    return { success: false, error: 'Error interno del servidor al eliminar' };
  }
}

export async function obtenerCursos(voluntarioId: number) {
  try {
    const cursos = await prisma.curso.findMany({
      where: { voluntarioId },
      orderBy: { creadoEn: 'desc' }
    });
    return { success: true, cursos };
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return { success: false, error: 'Error al obtener cursos' };
  }
}
