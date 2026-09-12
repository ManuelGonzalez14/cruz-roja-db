"use server";

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Inicializamos el cliente de Supabase solo si tenemos las variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function crearVoluntario(formData: FormData) {
  try {
    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const cedula = formData.get('cedula') as string;
    const telefono = formData.get('telefono') as string;
    const foto = formData.get('foto') as File | null;

    if (!nombre || !apellido || !cedula) {
      return { success: false, error: 'Nombre, apellido y cédula son requeridos' };
    }

    // Verificar si ya existe un voluntario con esa cédula
    const existente = await prisma.voluntario.findUnique({
      where: { cedula }
    });

    if (existente) {
      return { success: false, error: 'Ya existe un voluntario con esa cédula' };
    }

    let fotoUrl = null;

    // Subir la foto a Supabase si existe
    if (foto && foto.size > 0) {
      const extension = foto.name.split('.').pop();
      const nombreArchivo = `voluntario-${Date.now()}.${extension}`;
      
      // Convertir a Buffer (más seguro para Next.js Server Actions)
      const arrayBuffer = await foto.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase
        .storage
        .from('voluntarios')
        .upload(nombreArchivo, buffer, {
          contentType: foto.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error al subir imagen:', error);
        return { success: false, error: `Supabase Error: ${error.message}` };
      }

      // Obtener la URL pública de la imagen
      const { data: publicUrlData } = supabase
        .storage
        .from('voluntarios')
        .getPublicUrl(nombreArchivo);

      fotoUrl = publicUrlData.publicUrl;
    }

    // Guardar en la base de datos
    await prisma.voluntario.create({
      data: {
        nombre,
        apellido,
        cedula,
        telefono,
        fotoUrl
      }
    });

    // Refrescar la página para que aparezca el nuevo voluntario
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error al crear voluntario:', error);
    return { success: false, error: 'Error interno del servidor al guardar' };
  }
}
