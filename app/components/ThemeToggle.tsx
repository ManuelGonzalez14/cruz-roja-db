'use client';

import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Revisar si ya había preferencias guardadas
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="nav-item" 
      style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '0.5rem' }}
    >
      <span className="nav-icon">{isDark ? '☀️' : '🌙'}</span>
      {isDark ? 'Modo Claro' : 'Modo Oscuro'}
    </button>
  );
}
