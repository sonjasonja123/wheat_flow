import React, { useState } from 'react';
import { api } from '../services/api';
import { getRole } from '../services/auth';
import Input from '../components/Input';



export default function Register() {
  const roleId = getRole();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Ako nije admin ili owner → nema pristup
  if (![1, 4].includes(roleId)) {
    return <p className="register-error">Nemate pravo pristupa ovoj stranici</p>;
  }

  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Agronom' },
    { id: 4, name: 'Owner' },
    { id: 5, name: 'Radnik' }
  ];

  // Filtriranje po ulozi
  const allowedRoles =
    roleId === 1
      ? roles
      : roles.filter(r => [2, 3, 5].includes(r.id));

  const handleRegister = async () => {
    if (!name || !email || !password || !selectedRole) {
      return alert('Popunite sva polja');
    }

    try {
      await api.post('/users/register', {
        name,
        email,
        password,
        roleId: Number(selectedRole)
      });

      alert('Korisnik uspešno dodat');

      setName('');
      setEmail('');
      setPassword('');
      setSelectedRole('');
    } catch (err) {
      alert(err.response?.data?.message || 'Greška pri registraciji');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Dodaj korisnika</h2>

      <div className="register-field">
        <Input label="Ime" value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="register-field">
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <div className="register-field">
        <Input
          label="Lozinka"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <div className="register-field">
        <label>Uloga</label>
        <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
          <option value="">Izaberi ulogu</option>
          {allowedRoles.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <button className="register-button" onClick={handleRegister}>
        Dodaj korisnika
      </button>

      <p className="register-info">
        Samo admin i vlasnik mogu dodavati nove korisnike.
      </p>
    </div>
  );
}
