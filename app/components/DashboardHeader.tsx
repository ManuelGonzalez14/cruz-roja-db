"use client";

import React, { useState } from 'react';
import NewVolunteerModal from './NewVolunteerModal';

export default function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-title" style={{ fontSize: '1.75rem' }}>
          Panel de Voluntarios
        </div>
        <button className="primary-button" onClick={() => setIsModalOpen(true)}>
          + Nuevo Voluntario
        </button>
      </header>
      
      <NewVolunteerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
