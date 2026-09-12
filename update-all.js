const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockNombres = ["Alejandro", "Isabel", "Antonio", "Elena", "Fernando", "Beatriz", "Ricardo", "Margarita", "Javier", "Victoria"];
const mockApellidos = ["García", "Vega", "Herrera", "Mendoza", "Vargas", "Castro", "Ortiz", "Reyes", "Ramos", "Delgado"];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomCarnet() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function main() {
  const voluntarios = await prisma.voluntario.findMany({
    where: { id: { not: 2 } } // Exceptuar a Manuel
  });

  for (const vol of voluntarios) {
    const dataToUpdate = {
      especialidad: "Voluntario"
    };
    
    if (!vol.segundoNombre) {
      dataToUpdate.segundoNombre = random(mockNombres);
    }
    
    if (!vol.segundoApellido) {
      dataToUpdate.segundoApellido = random(mockApellidos);
    }
    
    if (!vol.numeroCarnet) {
      dataToUpdate.numeroCarnet = randomCarnet();
    }
    
    await prisma.voluntario.update({
      where: { id: vol.id },
      data: dataToUpdate
    });
  }

  console.log(`✅ Se actualizaron la especialidad, nombres/apellidos y carnets de ${voluntarios.length} voluntarios.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
