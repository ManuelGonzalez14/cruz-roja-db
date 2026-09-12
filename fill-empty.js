const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockData = {
  telefono: ["6123-4567", "6987-6543", "6541-2309", "6712-3498"],
  especialidad: ["Primeros Auxilios", "Rescate", "Logística", "Paramédico", "Conductor"],
  tipoSangre: ["O+", "A+", "B+", "AB+", "O-"],
  alergias: ["Ninguna", "Penicilina", "Polvo", "Ninguna", "Ninguna"],
  direccion: ["Las Tablas Centro", "Guararé", "Santo Domingo", "La Villa de Los Santos", "Tonosí"],
  tallaUniforme: ["S", "M", "L", "XL"],
  contactoEmergNombre: ["María", "José", "Carmen", "Luis", "Ana"],
  contactoEmergTelefono: ["6111-2222", "6333-4444", "6555-6666", "6777-8888"]
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const voluntarios = await prisma.voluntario.findMany({
    where: { id: { not: 2 } } // Exceptuar a Manuel
  });

  for (const vol of voluntarios) {
    const dataToUpdate = {};
    
    if (!vol.telefono) dataToUpdate.telefono = random(mockData.telefono);
    if (!vol.especialidad) dataToUpdate.especialidad = random(mockData.especialidad);
    if (!vol.tipoSangre) dataToUpdate.tipoSangre = random(mockData.tipoSangre);
    if (!vol.alergias) dataToUpdate.alergias = random(mockData.alergias);
    if (!vol.direccion) dataToUpdate.direccion = random(mockData.direccion);
    if (!vol.tallaUniforme) dataToUpdate.tallaUniforme = random(mockData.tallaUniforme);
    if (!vol.contactoEmergNombre) dataToUpdate.contactoEmergNombre = random(mockData.contactoEmergNombre) + " " + vol.apellido;
    if (!vol.contactoEmergTelefono) dataToUpdate.contactoEmergTelefono = random(mockData.contactoEmergTelefono);
    if (!vol.fechaNacimiento) {
      // Fecha aleatoria entre 1980 y 2000
      dataToUpdate.fechaNacimiento = randomDate(new Date(1980, 0, 1), new Date(2000, 0, 1));
    }
    
    // Si segundoNombre o segundoApellido están vacíos, no importa tanto, pero le ponemos un string vacío para no dejarlos en null si querían eso,
    // o mejor dejarlos en null. Solo rellenaremos los campos importantes de contacto e info médica.
    
    if (Object.keys(dataToUpdate).length > 0) {
      await prisma.voluntario.update({
        where: { id: vol.id },
        data: dataToUpdate
      });
    }
  }

  console.log(`✅ Se rellenaron los campos vacíos de ${voluntarios.length} voluntarios.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
