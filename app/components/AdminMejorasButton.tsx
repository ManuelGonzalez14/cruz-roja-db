"use client";

import React, { useState } from 'react';
import SugerirMejoraModal from './SugerirMejoraModal';

export default function AdminMejorasButton({ variant = 'side' }: { variant?: 'top' | 'side' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === 'top' ? (
        <button 
          onClick={() => setIsOpen(true)} 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem' }}
          className="hover:text-primary"
        >
          Sugerencias
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="icon-btn"
          data-tooltip="Sugerencias"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          💡
        </button>
      )}

      <SugerirMejoraModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
