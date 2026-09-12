'use client';

import React, { useState, useTransition } from 'react';
import { iniciarSesion } from '../acciones/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await iniciarSesion(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', width: '100%' }}>
            <img src="/logo.png" alt="Cruz Roja Panameña" style={{ width: '100%', maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
          </div>
          <h1 className="auth-title">Acceso Restringido</h1>
          <p className="auth-subtitle">Ingresa tus credenciales de la Cruz Roja</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(230, 0, 0, 0.1)', color: 'var(--cruz-roja-red)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(230,0,0,0.2)' }}>
            {error}
          </div>
        )}

        <form action={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className="form-input" 
              placeholder="admin@cruzroja.org.pa"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className="form-input" 
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="form-button" disabled={isPending}>
            {isPending ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </main>
  );
}
