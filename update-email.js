const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const oldEmail = "admin@cruzroja.org.pa";
  const newEmail = "manuel@cruzroja.org.pa";

  const usuario = await prisma.usuario.update({
    where: { email: oldEmail },
    data: { email: newEmail }
  });

  console.log("✅ Correo actualizado exitosamente a:", usuario.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
