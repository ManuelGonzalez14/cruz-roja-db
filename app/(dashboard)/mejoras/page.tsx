import React from 'react';
import { obtenerMejoras } from '../../acciones/mejoras';
import MejorasBoard from '../../components/MejorasBoard';

export const dynamic = 'force-dynamic';

export default async function MejorasPage() {
  const result = await obtenerMejoras();
  const mejoras = result.success && result.mejoras ? result.mejoras : [];

  return (
    <main className="container" style={{ maxWidth: '1400px' }}>
      <MejorasBoard initialMejoras={mejoras} />
    </main>
  );
}
