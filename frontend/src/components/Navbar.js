import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getRole, isAuthenticated, logout } from '../services/auth';
import { api } from '../services/api';
import logo from '../images/logo1.jpg';

const roleNames = { 1: 'Administrator', 2: 'Menadžer', 3: 'Agronom', 4: 'Vlasnik', 5: 'Radnik' };

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState(() => ({
    authenticated: isAuthenticated(),
    roleId: Number(getRole())
  }));
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const refreshAuth = () => setAuthState({
      authenticated: isAuthenticated(),
      roleId: Number(getRole())
    });
    window.addEventListener('auth-changed', refreshAuth);
    window.addEventListener('storage', refreshAuth);
    return () => {
      window.removeEventListener('auth-changed', refreshAuth);
      window.removeEventListener('storage', refreshAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      logout();
      closeMenu();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <NavLink to={authState.authenticated ? '/' : '/login'} className="navbar-logo" onClick={closeMenu}>
        <img className="navbar-logo-image" src={logo} alt="Wheat Flow logo" />
        <span>Wheat Flow</span>
      </NavLink>
      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        {authState.authenticated ? (
          <>
            <NavLink to="/" end onClick={closeMenu}>Početna</NavLink>
            <NavLink to="/fields" onClick={closeMenu}>Parcele</NavLink>
            <NavLink to="/productions" onClick={closeMenu}>Proizvodnje</NavLink>
            {[1, 2, 4].includes(authState.roleId) && <NavLink to="/expenses" onClick={closeMenu}>Troškovi</NavLink>}
            {[1, 2, 3, 4].includes(authState.roleId) && <NavLink to="/reports" onClick={closeMenu}>Izveštaji</NavLink>}
            <NavLink to="/notifications" onClick={closeMenu}>Obaveštenja</NavLink>
            <NavLink to="/activities" onClick={closeMenu}>Aktivnosti</NavLink>
            {[1, 4].includes(authState.roleId) && <NavLink to="/contracts" onClick={closeMenu}>Ugovori</NavLink>}
            {[1, 4].includes(authState.roleId) && <NavLink to="/register" onClick={closeMenu}>Korisnici</NavLink>}
            <span className="navbar-role">{roleNames[authState.roleId] || 'Korisnik'}</span>
            <button type="button" className="navbar-login navbar-button" onClick={handleLogout}>Odjava</button>
          </>
        ) : (
          <NavLink to="/login" className="navbar-login" onClick={closeMenu}>Prijava</NavLink>
        )}
      </div>
      <button className="burger" onClick={() => setIsOpen(!isOpen)} aria-label="Otvori navigaciju" aria-expanded={isOpen}>
        <span className={`line ${isOpen ? 'rotate1' : ''}`}></span>
        <span className={`line ${isOpen ? 'fade' : ''}`}></span>
        <span className={`line ${isOpen ? 'rotate2' : ''}`}></span>
      </button>
    </nav>
  );
}
