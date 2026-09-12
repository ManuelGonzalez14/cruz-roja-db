"use server";

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { voluntarioSchema } from '../lib/schemas';

const prisma = new PrismaClient();

// Inicializamos el cliente de Supabase solo si tenemos las variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function crearVoluntario(formData: FormData) {
  try {
    const rawData = {
      nombre: formData.get('nombre') as string,
      segundoNombre: (formData.get('segundoNombre') as string) || '',
      apellido: formData.get('apellido') as string,
      segundoApellido: (formData.get('segundoApellido') as string) || '',
      cedula: formData.get('cedula') as string,
      telefono: (formData.get('telefono') as string) || '',
      especialidad: (formData.get('especialidad') as string) || '',
      tipoSangre: (formData.get('tipoSangre') as string) || '',
      alergias: (formData.get('alergias') as string) || '',
      fechaNacimiento: (formData.get('fechaNacimiento') as string) || '',
      direccion: (formData.get('direccion') as string) || '',
      tallaUniforme: (formData.get('tallaUniforme') as string) || '',
      contactoEmergNombre: (formData.get('contactoEmergNombre') as string) || '',
      contactoEmergTelefono: (formData.get('contactoEmergTelefono') as string) || '',
    };

    const validatedFields = voluntarioSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error?.issues[0]?.message || 'Datos inválidos' };
    }

    const { nombre, segundoNombre, apellido, segundoApellido, cedula, telefono, especialidad, tipoSangre, alergias, fechaNacimiento, direccion, tallaUniforme, contactoEmergNombre, contactoEmergTelefono } = validatedFields.data;
    const foto = formData.get('foto') as File | null;

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
        segundoNombre,
        apellido,
        segundoApellido,
        cedula,
        telefono,
        especialidad,
        tipoSangre,
        alergias,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        direccion,
        tallaUniforme,
        contactoEmergNombre,
        contactoEmergTelefono,
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

export async function actualizarVoluntario(id: number, formData: FormData) {
  try {
    const rawData = {
      nombre: formData.get('nombre') as string,
      segundoNombre: (formData.get('segundoNombre') as string) || '',
      apellido: formData.get('apellido') as string,
      segundoApellido: (formData.get('segundoApellido') as string) || '',
      cedula: formData.get('cedula') as string,
      telefono: (formData.get('telefono') as string) || '',
      especialidad: (formData.get('especialidad') as string) || '',
      tipoSangre: (formData.get('tipoSangre') as string) || '',
      alergias: (formData.get('alergias') as string) || '',
      fechaNacimiento: (formData.get('fechaNacimiento') as string) || '',
      direccion: (formData.get('direccion') as string) || '',
      tallaUniforme: (formData.get('tallaUniforme') as string) || '',
      contactoEmergNombre: (formData.get('contactoEmergNombre') as string) || '',
      contactoEmergTelefono: (formData.get('contactoEmergTelefono') as string) || '',
      activo: formData.get('activo') === 'true'
    };

    const validatedFields = voluntarioSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error?.issues[0]?.message || 'Datos inválidos' };
    }

    const { nombre, segundoNombre, apellido, segundoApellido, cedula, telefono, especialidad, tipoSangre, alergias, fechaNacimiento, direccion, tallaUniforme, contactoEmergNombre, contactoEmergTelefono, activo } = validatedFields.data;
    const foto = formData.get('foto') as File | null;

    const existente = await prisma.voluntario.findUnique({ where: { id } });
    if (!existente) {
      return { success: false, error: 'Voluntario no encontrado' };
    }

    // Verificar si se intenta cambiar la cédula a una que ya existe en otro registro
    if (cedula !== existente.cedula) {
      const cedulaOcupada = await prisma.voluntario.findUnique({ where: { cedula } });
      if (cedulaOcupada) {
        return { success: false, error: 'Ya existe otro voluntario con esa cédula' };
      }
    }

    let fotoUrl = existente.fotoUrl;

    // Si hay una foto nueva, la subimos y borramos la vieja
    if (foto && foto.size > 0) {
      const extension = foto.name.split('.').pop();
      const nombreArchivo = `voluntario-${Date.now()}.${extension}`;
      
      const arrayBuffer = await foto.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error } = await supabase
        .storage
        .from('voluntarios')
        .upload(nombreArchivo, buffer, {
          contentType: foto.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { success: false, error: `Supabase Error: ${error.message}` };
      }

      // Borrar foto anterior de Supabase si existía
      if (fotoUrl) {
        const nombreArchivoViejo = fotoUrl.split('/').pop();
        if (nombreArchivoViejo) {
          await supabase.storage.from('voluntarios').remove([nombreArchivoViejo]);
        }
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('voluntarios')
        .getPublicUrl(nombreArchivo);

      fotoUrl = publicUrlData.publicUrl;
    }

    await prisma.voluntario.update({
      where: { id },
      data: {
        nombre,
        segundoNombre,
        apellido,
        segundoApellido,
        cedula,
        telefono,
        especialidad,
        tipoSangre,
        alergias,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        direccion,
        tallaUniforme,
        contactoEmergNombre,
        contactoEmergTelefono,
        fotoUrl,
        activo
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar voluntario:', error);
    return { success: false, error: 'Error interno al actualizar' };
  }
}

export async function eliminarVoluntario(id: number) {
  try {
    const existente = await prisma.voluntario.findUnique({ where: { id } });
    if (!existente) {
      return { success: false, error: 'Voluntario no encontrado' };
    }

    // Borrar foto de Supabase si tiene
    if (existente.fotoUrl) {
      const nombreArchivoViejo = existente.fotoUrl.split('/').pop();
      if (nombreArchivoViejo) {
        await supabase.storage.from('voluntarios').remove([nombreArchivoViejo]);
      }
    }

    await prisma.voluntario.delete({
      where: { id }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar voluntario:', error);
    return { success: false, error: 'Error interno al eliminar' };
  }
}
