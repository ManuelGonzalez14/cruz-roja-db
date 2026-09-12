import { PrismaClient } from '@prisma/client';

// Inicializamos el cliente de Prisma para interactuar con la base de datos
const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Conectando a la base de datos...\n');

  // 1. Crear un nuevo Voluntario en la base de datos
  const nuevoVoluntario = await prisma.voluntario.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      cedula: '8-123-4567',
      telefono: '6123-4567',
    },
  });
  console.log('✅ Nuevo voluntario registrado:');
  console.log(nuevoVoluntario);
  console.log('\n-----------------------------------\n');

  // 2. Consultar todos los voluntarios registrados
  const todosLosVoluntarios = await prisma.voluntario.findMany();
  
  console.log('📋 Lista completa de voluntarios en la base de datos:');
  console.dir(todosLosVoluntarios, { depth: null });
}

// Ejecutar la función principal y manejar errores
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Ocurrió un error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
