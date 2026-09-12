"use client";

import React, { useState } from 'react';
import EditVolunteerModal from './EditVolunteerModal';
import GestorCursosModal from './GestorCursosModal';
import ViewDetailsModal from './ViewDetailsModal';

interface Props {
  voluntario: any;
}

export default function VolunteerActions({ voluntario }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCursosOpen, setIsCursosOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <div className="table-actions">
        <button className="btn-icon" title="Ver Detalles" onClick={() => setIsDetailsOpen(true)}>👁️</button>
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

      {isDetailsOpen && (
        <ViewDetailsModal
          voluntario={voluntario}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </>
  );
}
