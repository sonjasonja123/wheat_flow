import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
        <span className="navbar-logo-mark">A</span>
        <span>AgroPanel</span>
      </NavLink>
      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={closeMenu}>Početna</NavLink>
        <NavLink to="/fields" onClick={closeMenu}>Parcele</NavLink>
        <NavLink to="/productions" onClick={closeMenu}>Proizvodnje</NavLink>
        <NavLink to="/expenses" onClick={closeMenu}>Troškovi</NavLink>
        <NavLink to="/reports" onClick={closeMenu}>Izveštaji</NavLink>
        <NavLink to="/notifications" onClick={closeMenu}>Obaveštenja</NavLink>
        <NavLink to="/register" onClick={closeMenu}>Korisnici</NavLink>
        <NavLink to="/login" className="navbar-login" onClick={closeMenu}>Prijava</NavLink>
      </div>
      <button className="burger" onClick={() => setIsOpen(!isOpen)} aria-label="Otvori navigaciju" aria-expanded={isOpen}>
        <span className={`line ${isOpen ? 'rotate1' : ''}`}></span>
        <span className={`line ${isOpen ? 'fade' : ''}`}></span>
        <span className={`line ${isOpen ? 'rotate2' : ''}`}></span>
      </button>
    </nav>
  );
}
