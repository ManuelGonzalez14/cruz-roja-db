const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.voluntario.update({
    where: { id: 1 },
    data: { numeroCarnet: "1024" }
  });

  await prisma.voluntario.update({
    where: { id: 3 },
    data: { numeroCarnet: "2048" }
  });

  console.log("✅ Carnets asignados a Juan Pérez (1024) y Ana Pérez (2048).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
