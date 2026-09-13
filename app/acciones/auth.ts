'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function iniciarSesion(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Por favor, llena todos los campos.' };
  }

  // 1. Buscar al usuario en la base de datos
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { voluntario: true }
  });

  if (!usuario) {
    return { error: 'Correo o contraseña incorrectos.' };
  }

  // 1.5 Verificar si la cuenta está aprobada
  if (usuario.rol === 'VOLUNTARIO' && usuario.voluntario && !usuario.voluntario.activo) {
    return { error: 'Tu cuenta de voluntario está pendiente de aprobación por un administrador.' };
  }

  // 2. Verificar que la contraseña coincida
  const contrasenaValida = await bcrypt.compare(password, usuario.password);

  if (!contrasenaValida) {
    return { error: 'Correo o contraseña incorrectos.' };
  }

  // 3. Crear una cookie segura para recordar la sesión (expira en 1 día)
  const expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  // Usamos un objeto cookies() awaitable para compatibilidad con Next.js 15
  const cookieStore = await cookies();
  cookieStore.set('session_cruz_roja', usuario.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expireDate,
    path: '/',
  });

  // 4. Redirigir a la página principal
  redirect('/');
}

export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete('session_cruz_roja');
  redirect('/login');
}

export async function registrarVoluntario(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const segundoNombre = formData.get('segundoNombre') as string;
  const apellido = formData.get('apellido') as string;
  const segundoApellido = formData.get('segundoApellido') as string;
  const cedula = formData.get('cedula') as string;
  const fechaNacimiento = formData.get('fechaNacimiento') as string;
  const telefono = formData.get('telefono') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!nombre || !apellido || !cedula || !email || !password) {
    return { error: 'Por favor, llena todos los campos.' };
  }

  // Verificar si el correo o cédula ya existen
  const [existingUser, existingVoluntario] = await Promise.all([
    prisma.usuario.findUnique({ where: { email } }),
    prisma.voluntario.findUnique({ where: { cedula } })
  ]);

  if (existingUser) {
    return { error: 'El correo electrónico ya está registrado.' };
  }

  if (existingVoluntario) {
    return { error: 'La cédula ya está registrada en el sistema.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Transacción para crear Voluntario Inactivo y Usuario vinculado
    await prisma.$transaction(async (tx) => {
      const nuevoVoluntario = await tx.voluntario.create({
        data: {
          nombre,
          segundoNombre: segundoNombre || null,
          apellido,
          segundoApellido: segundoApellido || null,
          cedula,
          fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
          telefono: telefono || null,
          activo: false, // Esperando aprobación
        }
      });

      await tx.usuario.create({
        data: {
          email,
          password: hashedPassword,
          rol: 'VOLUNTARIO',
          voluntarioId: nuevoVoluntario.id
        }
      });
    });

    return { success: true };
  } catch (err) {
    console.error('Error registrando voluntario:', err);
    return { error: 'Hubo un problema al crear la cuenta. Intenta de nuevo.' };
  }
}

