"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Settings, LogOut, Lock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

export default function UserNav({
  nombreVoluntario,
  isVoluntario,
  isDesarrollador
}: {
  nombreVoluntario: string;
  isVoluntario: boolean;
  isDesarrollador: boolean;
}) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAllRead = () => {
    setUnreadCount(0);
    setShowNotif(false);
  };

  const handleLogout = async () => {
    // Basic logout logic to call an action or clear cookies
    window.location.href = '/login';
  };

  return (
    <div className="user-mini-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
      
      {/* NOTIFICATIONS */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button 
          className="vd-icon-btn" 
          onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
          style={{ padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', color: 'inherit' }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="vd-badge" style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--cruz-roja-red)', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>
              {unreadCount}
            </span>
          )}
        </button>

        {showNotif && (
          <div className="dropdown-menu notif-dropdown">
            <div className="dropdown-header">
              <h4>Notificaciones</h4>
              {unreadCount > 0 && <span className="badge-count">{unreadCount} nuevas</span>}
            </div>
            <div className="dropdown-body">
              <div className="notif-item unread">
                <div className="notif-icon">📅</div>
                <div className="notif-content">
                  <p>Tienes un turno asignado mañana a las 09:00 AM.</p>
                  <span>Hace 2 horas</span>
                </div>
              </div>
              <div className="notif-item unread">
                <div className="notif-icon">🎓</div>
                <div className="notif-content">
                  <p>Se ha publicado el curso de 'Primeros Auxilios Avanzados'.</p>
                  <span>Hace 5 horas</span>
                </div>
              </div>
              <div className="notif-item unread">
                <div className="notif-icon">⚠️</div>
                <div className="notif-content">
                  <p>Aviso importante: Actualización de protocolos COVID-19.</p>
                  <span>Ayer</span>
                </div>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="dropdown-footer">
                <button onClick={markAllRead} className="btn-text">Marcar todas como leídas</button>
              </div>
            )}
          </div>
        )}
      </div>

      <ThemeToggle />

      {/* USER PROFILE */}
      <div ref={profileRef} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem', position: 'relative' }} onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}>
        {isDesarrollador ? (
          <div className="profile-icon-circle" style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cruz-roja-red)', fontSize: '1.4rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            ✚
          </div>
        ) : (
          <img 
            src={isVoluntario ? "https://i.pravatar.cc/150?img=47" : "https://i.pravatar.cc/150?img=11"} 
            alt="Profile" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <span className="vd-profile-name" style={{ textTransform: 'capitalize', userSelect: 'none' }}>
          {isDesarrollador ? `${nombreVoluntario} DEV` : nombreVoluntario} ⌄
        </span>

        {showProfile && (
          <div className="dropdown-menu profile-dropdown">
            <div className="dropdown-header profile-header">
              <strong>{nombreVoluntario}</strong>
              <span>{isVoluntario ? 'Voluntario Activo' : 'Administrador'}</span>
            </div>
            
            <Link href="/perfil" className="dropdown-item">
              <User size={16} /> Ver mi Perfil
            </Link>
            
            <div className="dropdown-item disabled">
              <Settings size={16} /> Ajustes de cuenta (Pronto)
            </div>
            
            <div className="dropdown-item disabled">
              <Lock size={16} /> Cambiar Contraseña (Pronto)
            </div>
            
            <div className="dropdown-divider"></div>
            
            <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
              <button type="submit" className="dropdown-item text-red">
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
