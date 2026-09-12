const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const voluntarios = await prisma.voluntario.findMany({
    select: {
      id: true,
      nombre: true,
      segundoNombre: true,
      apellido: true,
      segundoApellido: true,
      numeroCarnet: true
    }
  });
  console.log("VOLUNTARIOS:");
  console.log(JSON.stringify(voluntarios, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
