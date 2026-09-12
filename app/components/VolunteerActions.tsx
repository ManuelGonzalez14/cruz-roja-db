"use client";

import React, { useState } from 'react';
import EditVolunteerModal from './EditVolunteerModal';
import GestorCursosModal from './GestorCursosModal';

interface Props {
  voluntario: any;
}

export default function VolunteerActions({ voluntario }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCursosOpen, setIsCursosOpen] = useState(false);

  return (
    <>
      <div className="table-actions">
        <button className="btn-icon" title="Ver Detalles">👁️</button>
        <button className="btn-icon" title="Cursos" onClick={() => setIsCursosOpen(true)}>🎓</button>
        <button className="btn-icon" title="Editar" onClick={() => setIsEditOpen(true)}>✏️</button>
      </div>

      <EditVolunteerModal 
        voluntario={voluntario} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />

      <GestorCursosModal
        voluntario={voluntario}
        isOpen={isCursosOpen}
        onClose={() => setIsCursosOpen(false)}
      />
    </>
  );
}
