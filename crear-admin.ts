import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Creando usuario de desarrollo...');

  // 1. Definimos los datos del administrador
  const emailAdmin = 'admin@cruzroja.org.pa';
  const passwordPlana = 'AdminCruzRoja123'; // ¡Esta será la contraseña para entrar!

  // 2. Ciframos la contraseña por seguridad (nunca guardar en texto plano)
  const salt = await bcrypt.genSalt(10);
  const passwordCifrada = await bcrypt.hash(passwordPlana, salt);

  // 3. Verificamos si el usuario ya existe para no duplicarlo
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: emailAdmin }
  });

  if (usuarioExistente) {
    console.log(`⚠️ El usuario ${emailAdmin} ya existe en la base de datos.`);
    return;
  }

  // 4. Guardamos el usuario en Supabase
  const nuevoUsuario = await prisma.usuario.create({
    data: {
      email: emailAdmin,
      password: passwordCifrada,
      rol: 'DESARROLLADOR',
    },
  });

  console.log('✅ ¡Usuario de desarrollo creado con éxito!');
  console.log('Email:', nuevoUsuario.email);
  console.log('Rol:', nuevoUsuario.rol);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
