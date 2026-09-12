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
  });

  if (!usuario) {
    return { error: 'Correo o contraseña incorrectos.' };
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
