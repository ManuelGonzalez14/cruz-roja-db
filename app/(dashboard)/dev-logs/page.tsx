"use client";

import React, { useEffect, useState } from 'react';

interface LogEntry {
  id: number;
  accion: string;
  pagina: string | null;
  detalles: string | null;
  usuarioId: number | null;
  rolUsuario: string | null;
  creadoEn: string;
}

export default function DevLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          setError('Acceso denegado. Solo Manuel DEV puede ver esto.');
        } else {
          setError('Error al obtener los logs');
        }
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error de red');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Auto refresh every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>Cargando logs del sistema...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'var(--cruz-roja-red)' }}>
        <h2>Acceso Restringido</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Logs del Sistema</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Monitoreo en tiempo real (solo DEV)</p>
        </div>
        <button onClick={fetchLogs} className="btn-solid-red" style={{ padding: '0.5rem 1rem' }}>
          Actualizar ahora
        </button>
      </div>

      <div style={{ background: 'var(--surface-color, #1e222b)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Fecha / Hora</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Usuario (Rol)</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Página</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Acción</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No hay actividad reciente.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {new Date(log.creadoEn).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: log.rolUsuario === 'VOLUNTARIO' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(230,0,0,0.2)', color: log.rolUsuario === 'VOLUNTARIO' ? '#3b82f6' : 'var(--cruz-roja-red)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {log.rolUsuario}
                    </span>
                    <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>ID: {log.usuarioId || 'Anónimo'}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{log.pagina || '-'}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{log.accion}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.detalles || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
