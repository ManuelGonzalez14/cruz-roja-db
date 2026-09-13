const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createVolunteerAccount() {
  try {
    const email = 'voluntario@cruzroja.org';
    const password = await bcrypt.hash('voluntario123', 10);
    
    // Revisar si ya existe
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      console.log('La cuenta de prueba ya existe.');
      return;
    }

    await prisma.usuario.create({
      data: {
        email: email,
        password: password,
        rol: 'VOLUNTARIO',
      },
    });

    console.log('✅ Cuenta de prueba de VOLUNTARIO creada exitosamente:');
    console.log('Correo: voluntario@cruzroja.org');
    console.log('Clave: voluntario123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createVolunteerAccount();
