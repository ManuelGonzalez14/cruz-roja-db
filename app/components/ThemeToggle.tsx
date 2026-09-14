"use client";

import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('cruz_roja_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('cruz_roja_theme', 'light');
    }
  };

  useEffect(() => {
    // Restore from localStorage if available
    const savedTheme = localStorage.getItem('cruz_roja_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <button 
      onClick={toggleTheme} 
      style={{ 
        background: 'transparent', 
        border: 'none', 
        cursor: 'pointer', 
        fontSize: '1.4rem', 
        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.2rem',
        marginRight: '0.5rem'
      }} 
      title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
