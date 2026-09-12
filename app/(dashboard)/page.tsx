import { PrismaClient } from '@prisma/client';
import DashboardHeader from '../components/DashboardHeader';
import SearchBar from '../components/SearchBar';
import VolunteerActions from '../components/VolunteerActions';

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

  const [voluntarios, totalVoluntarios, activos] = await Promise.all([
    prisma.voluntario.findMany(findArgs),
    prisma.voluntario.count(),
    prisma.voluntario.count({ where: { activo: true } })
  ]);

  const inactivos = totalVoluntarios - activos;

  return (
    <main className="container">
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
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Rol / Sangre</th>
                <th>Estado</th>
                <th>Fecha de Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {voluntarios.map((voluntario) => {
                const iniciales = `${voluntario.nombre.charAt(0)}${voluntario.apellido.charAt(0)}`.toUpperCase();
                
                return (
                  <tr key={voluntario.id}>
                    <td>
                      <div className="volunteer-profile">
                        {(voluntario as any).fotoUrl ? (
                          <img src={(voluntario as any).fotoUrl} alt={voluntario.nombre} className="avatar" />
                        ) : (
                          <div className="avatar">{iniciales}</div>
                        )}
                        <span style={{ fontWeight: 600 }}>
                          {voluntario.nombre} {voluntario.segundoNombre ? voluntario.segundoNombre + ' ' : ''}
                          {voluntario.apellido} {voluntario.segundoApellido ? voluntario.segundoApellido : ''}
                        </span>
                      </div>
                    </td>
                  <td>{voluntario.cedula}</td>
                  <td>{voluntario.telefono || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{(voluntario as any).especialidad || 'Sin especialidad'}</span>
                      {(voluntario as any).tipoSangre && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--cruz-roja-red)' }}>Sangre: {(voluntario as any).tipoSangre}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {voluntario.activo ? (
                      <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#059669', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        ACTIVO
                      </span>
                    ) : (
                      <span style={{ backgroundColor: 'rgba(107, 114, 128, 0.15)', color: '#4b5563', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        INACTIVO
                      </span>
                    )}
                  </td>
                  <td>{new Date(voluntario.creadoEn).toLocaleDateString('es-PA')}</td>
                  <td>
                    <VolunteerActions voluntario={voluntario} />
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
