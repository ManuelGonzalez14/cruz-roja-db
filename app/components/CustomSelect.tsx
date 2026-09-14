"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CustomSelect({ name, options, value, onChange, placeholder = "Seleccione...", required = false }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronizar el valor si cambia desde afuera
  useEffect(() => {
    setCurrentValue(value || '');
  }, [value]);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    setCurrentValue(val);
    setIsOpen(false);
    if (onChange) onChange(val);
  };

  const selectedOption = options.find(o => o.value === currentValue);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input oculto para que el FormData lo envíe al servidor */}
      {name && <input type="hidden" name={name} value={currentValue} />}
      
      {/* Input nativo oculto solo para validación HTML5 si es requerido */}
      {required && (
         <input 
           type="text" 
           required 
           value={currentValue} 
           onChange={() => {}} 
           style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '100%', height: '100%', bottom: 0 }} 
         />
      )}

      {/* Botón que abre el menú */}
      <div 
        className="search-input custom-select-btn"
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          userSelect: 'none',
          borderColor: isOpen ? 'var(--cruz-roja-red)' : 'var(--border-color)',
          boxShadow: isOpen ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cruz-roja-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* Menú Desplegable Flotante */}
      {isOpen && (
        <div className="custom-select-dropdown" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          maxHeight: '250px',
          overflowY: 'auto',
          padding: '0.5rem'
        }}>
          {options.length === 0 && (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-tertiary)' }}>Sin opciones</div>
          )}
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-select-option ${currentValue === opt.value ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
