'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Obtener todas las ambulancias
export async function getAmbulancias() {
  return await prisma.ambulancia.findMany({
    include: { insumos: true },
    orderBy: { creadoEn: 'desc' }
  });
}

// Registrar nueva ambulancia
export async function agregarAmbulancia(formData: FormData) {
  const placa = formData.get('placa') as string;
  const modelo = formData.get('modelo') as string;
  const estado = formData.get('estado') as string;

  if (!placa) return { error: 'La placa es obligatoria.' };

  try {
    await prisma.ambulancia.create({
      data: { placa, modelo, estado: estado || 'Operativa' }
    });
    revalidatePath('/ambulancias');
    return { success: true };
  } catch (error) {
    return { error: 'Error al registrar la ambulancia (posiblemente la placa ya existe).' };
  }
}

// Eliminar ambulancia
export async function eliminarAmbulancia(id: number) {
  try {
    await prisma.ambulancia.delete({ where: { id } });
    revalidatePath('/ambulancias');
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar ambulancia.' };
  }
}

// Editar ambulancia
export async function editarAmbulancia(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const placa = formData.get('placa') as string;
  const modelo = formData.get('modelo') as string;
  const estado = formData.get('estado') as string;

  if (!id || !placa) return { error: 'Faltan datos obligatorios.' };

  try {
    await prisma.ambulancia.update({
      where: { id },
      data: { placa, modelo, estado }
    });
    revalidatePath('/ambulancias');
    return { success: true };
  } catch (error) {
    return { error: 'Error al editar la ambulancia (posiblemente la placa ya existe).' };
  }
}

// Agregar o Actualizar Insumo
export async function guardarInsumo(formData: FormData) {
  const ambulanciaId = parseInt(formData.get('ambulanciaId') as string);
  const insumoId = formData.get('insumoId') ? parseInt(formData.get('insumoId') as string) : null;
  
  const nombre = formData.get('nombre') as string;
  const cantidad = parseInt(formData.get('cantidad') as string);
  const categoria = formData.get('categoria') as string;

  if (!nombre || !ambulanciaId || isNaN(cantidad)) {
    return { error: 'Faltan datos requeridos (Nombre, Cantidad).' };
  }

  try {
    if (insumoId) {
      // Actualizar insumo existente
      await prisma.insumoAmbulancia.update({
        where: { id: insumoId },
        data: { nombre, cantidad, categoria }
      });
    } else {
      // Crear nuevo insumo
      await prisma.insumoAmbulancia.create({
        data: { nombre, cantidad, categoria, ambulanciaId }
      });
    }
    revalidatePath('/ambulancias');
    return { success: true };
  } catch (error) {
    return { error: 'Error al guardar el insumo.' };
  }
}

// Actualizar cantidad rápida (+ / -)
export async function ajustarCantidadInsumo(insumoId: number, nuevaCantidad: number) {
  try {
    await prisma.insumoAmbulancia.update({
      where: { id: insumoId },
      data: { cantidad: nuevaCantidad }
    });
    revalidatePath('/ambulancias');
    return { success: true };
  } catch (error) {
    return { error: 'Error al actualizar cantidad.' };
  }
}

// Eliminar Insumo
export async function eliminarInsumo(id: number) {
  try {
    await prisma.insumoAmbulancia.delete({ where: { id } });
    revalidatePath('/ambulancias');
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar insumo.' };
  }
}
