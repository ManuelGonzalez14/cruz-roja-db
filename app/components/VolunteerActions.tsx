"use client";

import React, { useState } from 'react';
import EditVolunteerModal from './EditVolunteerModal';
import GestorCursosModal from './GestorCursosModal';
import ViewDetailsModal from './ViewDetailsModal';

interface Props {
  voluntario: any;
  isDetailsOpen?: boolean;
  onCloseDetails?: () => void;
}

export default function VolunteerActions({ voluntario, isDetailsOpen: externalDetailsOpen, onCloseDetails }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCursosOpen, setIsCursosOpen] = useState(false);
  const [internalDetailsOpen, setInternalDetailsOpen] = useState(false);

  const detailsOpen = externalDetailsOpen ?? internalDetailsOpen;
  const closeDetails = onCloseDetails ?? (() => setInternalDetailsOpen(false));

  return (
    <>
      <div className="table-actions" onClick={(e) => e.stopPropagation()}>
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

      {detailsOpen && (
        <ViewDetailsModal
          voluntario={voluntario}
          isOpen={detailsOpen}
          onClose={closeDetails}
        />
      )}
    </>
  );
}

