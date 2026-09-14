import React from 'react';
import { obtenerNoticias } from '../../acciones/comunidad';
import GestorComunidadClient from './GestorComunidadClient';

export default async function GestionarComunidadPage() {
  const noticias = await obtenerNoticias();

  return (
    <div className="page-container page-comunidad-admin">
      <div className="page-header">
        <div>
          <h2>Gestión de Comunidad y Noticias</h2>
          <p>Publica anuncios, actualizaciones y misiones para los voluntarios</p>
        </div>
      </div>
      
      <GestorComunidadClient noticiasIniciales={noticias} />
    </div>
  );
}

