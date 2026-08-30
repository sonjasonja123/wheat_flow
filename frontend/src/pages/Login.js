import React, { useState } from 'react';
import { api, setAuthToken } from '../services/api';
import { saveAuth } from '../services/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/users/login', { email, password });

      // Sačuvaj token i korisnika
      saveAuth(res.data);
      // Postavi token u axios
      setAuthToken(res.data.token);

      alert('Login successful!');

      // Preusmeri korisnika na productions stranicu
      navigate('/productions');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
      <div className="auth-kicker">Dobro došli nazad</div>
      <h2>Prijava na Wheat Flow</h2>
      <p className="auth-intro">Pristupite podacima o parcelama, proizvodnji i troškovima.</p>
      <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <label className="password-visibility-toggle">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={e => setShowPassword(e.target.checked)}
        />
        Prikaži lozinku
      </label>
      <Button onClick={handleLogin} className="auth-submit">Prijavi se</Button>
      </div>
    </div>
  );
}
