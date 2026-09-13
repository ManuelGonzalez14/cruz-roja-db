'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RecuperarPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    // Simular el envío de un correo de recuperación
    setTimeout(() => {
      setIsPending(false);
      setEnviado(true);
    }, 1500);
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', width: '100%' }}>
            <img src="/logo.png" alt="Cruz Roja Panameña" style={{ width: '100%', maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
          </div>
          <h1 className="auth-title">Recuperar Contraseña</h1>
          <p className="auth-subtitle">
            {enviado 
              ? 'Revisa tu bandeja de entrada' 
              : 'Ingresa tu correo para recibir las instrucciones de recuperación'}
          </p>
        </div>

        {enviado ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>¡Correo Enviado!</p>
              <p style={{ fontSize: '0.9rem' }}>
                Si el correo <strong>{email}</strong> está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
              </p>
            </div>
            
            <Link href="/login" className="form-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Volver al Inicio de Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo Electrónico Registrado</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-input" 
                placeholder="ejemplo@cruzroja.org.pa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="form-button" disabled={isPending || !email}>
              {isPending ? 'Enviando Instrucciones...' : 'Enviar Enlace de Recuperación'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link href="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                Volver al Inicio de Sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
