import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import DashboardHeader from '../components/DashboardHeader';
import SearchBar from '../components/SearchBar';
import VolunteerCard from '../components/VolunteerCard';
import VolunteerDashboard from '../components/VolunteerDashboard';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export default async function DashboardPage(
  props: {
    searchParams?: Promise<{
      q?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';

  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_cruz_roja')?.value;
  let rol = 'ADMIN';
  
  let voluntarioId: number | null = null;
  
  if (sessionId) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(sessionId) }
    });
    if (usuario) {
      rol = usuario.rol;
      voluntarioId = usuario.voluntarioId;
    }
  }

  const tempRol = cookieStore.get('temp_rol')?.value;
  if (tempRol) rol = tempRol;

  if (rol === 'VOLUNTARIO') {
    if (!voluntarioId) {
      return (
        <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', maxWidth: '400px' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Perfil no vinculado</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Tu cuenta no está vinculada a ningún perfil de voluntario. Por favor, contacta a un administrador.</p>
          </div>
        </div>
      );
    }

    const voluntarioData = await prisma.voluntario.findUnique({
      where: { id: voluntarioId },
      include: { cursos: true }
    });
    
    if (!voluntarioData) {
      return <div style={{ padding: '3rem', textAlign: 'center' }}>No se pudo cargar la información del voluntario.</div>;
    }

    return (
      <VolunteerDashboard 
        voluntario={voluntarioData} 
        cursos={voluntarioData.cursos || []} 
      />
    );
  }

  // --- VISTA DE ADMINISTRADOR ---
  const findArgs: any = {
    orderBy: { creadoEn: 'desc' }
  };

  if (query) {
    findArgs.where = {
      OR: [
        { nombre: { contains: query, mode: 'insensitive' } },
        { apellido: { contains: query, mode: 'insensitive' } },
        { cedula: { contains: query, mode: 'insensitive' } }
      ]
    };
  }

  const [rawVoluntarios, totalVoluntarios, activos] = await Promise.all([
    prisma.voluntario.findMany(findArgs),
    prisma.voluntario.count(),
    prisma.voluntario.count({ where: { activo: true } })
  ]);

  // Serializar los datos de Prisma a objetos planos para evitar errores de "Server Components render" en Vercel
  const voluntarios = JSON.parse(JSON.stringify(rawVoluntarios));

  const inactivos = totalVoluntarios - activos;

  return (
    <div className="page-container">
      <DashboardHeader />

      {/* Estadísticas Rápidas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Voluntarios</h3>
            <p>{totalVoluntarios}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>✅</div>
          <div className="stat-info">
            <h3>Activos</h3>
            <p>{activos}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#6b7280', backgroundColor: 'rgba(107, 114, 128, 0.1)' }}>💤</div>
          <div className="stat-info">
            <h3>Inactivos</h3>
            <p>{inactivos}</p>
          </div>
        </div>
      </div>

      {/* Barra de Herramientas */}
      <div className="toolbar">
        <SearchBar />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-icon" title="Filtrar">
            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
          </button>
          <button className="btn-icon" title="Exportar a Excel">
            <span style={{ fontSize: '1.2rem' }}>📥</span>
          </button>
        </div>
      </div>

      {/* Tabla de Voluntarios */}
      <div className="table-container">
        {voluntarios.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No hay voluntarios registrados aún.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1rem', padding: '0.5rem 0.5rem 2rem 0.5rem' }}>
            {voluntarios.map((voluntario: any) => (
              <VolunteerCard key={voluntario.id} voluntario={voluntario} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
