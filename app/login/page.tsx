'use client';

import React, { useState, useTransition } from 'react';
import { iniciarSesion, registrarVoluntario } from '../acciones/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginPending, startLoginTransition] = useTransition();

  // Register State
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [isRegisterPending, startRegisterTransition] = useTransition();

  const handleLogin = async (formData: FormData) => {
    setLoginError(null);
    startLoginTransition(async () => {
      const result = await iniciarSesion(formData);
      if (result?.error) {
        setLoginError(result.error);
      }
    });
  };

  const handleRegister = async (formData: FormData) => {
    setRegisterError(null);
    startRegisterTransition(async () => {
      const result = await registrarVoluntario(formData);
      if (result?.error) {
        setRegisterError(result.error);
      } else {
        setRegisterSuccess(true);
      }
    });
  };

  return (
    <main className="auth-container">
      <div className="auth-card" style={{ maxWidth: '450px' }}>
        <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', width: '100%' }}>
            <img src="/logo.png" alt="Cruz Roja Panameña" style={{ width: '100%', maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
          </div>
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => { setActiveTab('login'); setRegisterSuccess(false); }}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                background: 'transparent', 
                border: 'none', 
                borderBottom: activeTab === 'login' ? '3px solid var(--cruz-roja-red)' : '3px solid transparent',
                fontWeight: activeTab === 'login' ? 700 : 500,
                color: activeTab === 'login' ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Ya tengo cuenta
            </button>
            <button 
              onClick={() => { setActiveTab('register'); setRegisterSuccess(false); }}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                background: 'transparent', 
                border: 'none', 
                borderBottom: activeTab === 'register' ? '3px solid var(--cruz-roja-red)' : '3px solid transparent',
                fontWeight: activeTab === 'register' ? 700 : 500,
                color: activeTab === 'register' ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Soy Nuevo
            </button>
          </div>
          
          {activeTab === 'login' && (
            <>
              <h1 className="auth-title">Acceso Restringido</h1>
              <p className="auth-subtitle">Ingresa tus credenciales de la Cruz Roja</p>
            </>
          )}

          {activeTab === 'register' && !registerSuccess && (
            <>
              <h1 className="auth-title" style={{ fontSize: '1.5rem' }}>Únete como Voluntario</h1>
              <p className="auth-subtitle">Crea tu cuenta para acceder al sistema</p>
            </>
          )}
        </div>

        {/* ================= LOGIN FORM ================= */}
        {activeTab === 'login' && (
          <>
            {loginError && (
              <div style={{ backgroundColor: 'rgba(230, 0, 0, 0.1)', color: 'var(--cruz-roja-red)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(230,0,0,0.2)' }}>
                {loginError}
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
                  placeholder="ejemplo@cruzroja.org.pa"
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

              <button type="submit" className="form-button" disabled={isLoginPending}>
                {isLoginPending ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link href="/recuperar" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </>
        )}


        {/* ================= REGISTER FORM ================= */}
        {activeTab === 'register' && (
          <>
            {registerSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  ¡Registro Completado!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  Tu cuenta ha sido creada exitosamente. Sin embargo, para mantener la seguridad del sistema, 
                  <strong> un administrador debe aprobar tu perfil </strong> antes de que puedas iniciar sesión.
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  Te notificaremos cuando tu acceso sea habilitado.
                </p>
                <button 
                  onClick={() => { setActiveTab('login'); setRegisterSuccess(false); }}
                  className="form-button"
                  style={{ background: 'var(--bg-color-alt)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
                >
                  Volver al Inicio
                </button>
              </div>
            ) : (
              <>
                {registerError && (
                  <div style={{ backgroundColor: 'rgba(230, 0, 0, 0.1)', color: 'var(--cruz-roja-red)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(230,0,0,0.2)' }}>
                    {registerError}
                  </div>
                )}

                <form action={handleRegister}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="nombre">Primer Nombre *</label>
                      <input type="text" id="nombre" name="nombre" className="form-input" placeholder="Juan" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="segundoNombre">Segundo Nombre</label>
                      <input type="text" id="segundoNombre" name="segundoNombre" className="form-input" placeholder="Antonio" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="apellido">Primer Apellido *</label>
                      <input type="text" id="apellido" name="apellido" className="form-input" placeholder="Pérez" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="segundoApellido">Segundo Apellido</label>
                      <input type="text" id="segundoApellido" name="segundoApellido" className="form-input" placeholder="García" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cedula">Cédula *</label>
                      <input type="text" id="cedula" name="cedula" className="form-input" placeholder="8-000-0000" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="telefono">Celular</label>
                      <input type="tel" id="telefono" name="telefono" className="form-input" placeholder="6123-4567" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                    <input type="date" id="fechaNacimiento" name="fechaNacimiento" className="form-input" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg_email">Correo Electrónico</label>
                    <input type="email" id="reg_email" name="email" className="form-input" placeholder="ejemplo@cruzroja.org.pa" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg_password">Crear Contraseña</label>
                    <input type="password" id="reg_password" name="password" className="form-input" placeholder="Mínimo 6 caracteres" required minLength={6} />
                  </div>

                  <button type="submit" className="form-button" disabled={isRegisterPending} style={{ marginTop: '0.5rem' }}>
                    {isRegisterPending ? 'Creando cuenta...' : 'Registrarme'}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
