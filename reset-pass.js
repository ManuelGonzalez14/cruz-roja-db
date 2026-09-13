const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = "voluntario@cruzroja.org";
  const newPassword = "voluntario123";
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const usuario = await prisma.usuario.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log("✅ Contraseña restablecida exitosamente para:", usuario.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
