"use client";

import React, { useState } from 'react';
import SugerirMejoraModal from './SugerirMejoraModal';

export default function AdminMejorasButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="nav-item"
        style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)' }}
      >
        <span className="nav-icon">💡</span>
        Sugerir Mejora
      </button>

      <SugerirMejoraModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
