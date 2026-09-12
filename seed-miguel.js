const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'miguel@cruzroja.org';
  const password = 'cruzrojaadmin';

  // Verificar si ya existe
  const existente = await prisma.usuario.findUnique({
    where: { email }
  });

  if (existente) {
    console.log('El usuario ya existe:', existente.email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      rol: 'ADMIN'
    }
  });

  console.log('✅ Usuario creado exitosamente:');
  console.log('Email:', usuario.email);
  console.log('Rol:', usuario.rol);
  console.log('Contraseña:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
