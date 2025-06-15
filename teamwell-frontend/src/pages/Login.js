import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    console.log('Trimitere login pentru: ', email);

    try {
      const res = await API.post('/login', { email, password });
      console.log('LOGIN response data:', res.data);

      const { token, user } = res.data;
      if (!token || !user) {
        console.error('Lipsește token sau user în răspuns:', res.data);
        setError('Răspuns invalid de la server');
        return;
      }

      const storedUser = { ...user, token };
      localStorage.setItem('user', JSON.stringify(storedUser));
      console.log('Saved to localStorage:', storedUser);

      console.log('Navigating to /questionnaires');
      navigate('/questionnaires');
    } catch (err) {
      console.error('Eroare login:', err.response || err);
      setError(err.response?.data?.message || 'Date invalide');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={logoStyle}>
        <img src="/logo.svg" alt="TeamWell logo" style={{ width: '250px' }} />
      </div>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={titleStyle}>Autentificare</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        {error && <p style={errorStyle}>{error}</p>}
        <button type="submit" style={buttonStyle}>
          Intră în cont
        </button>
        <div style={linkContainerStyle}>
          Nu ai cont?{' '}
          <Link to="/register" style={registerLinkStyle}>
            Creează cont
          </Link>
        </div>
        <div style={homeLinkContainer}>
          <Link to="/" style={homeLinkStyle}>
            Pagina Principală
          </Link>
        </div>
      </form>
    </div>
  );
}

// — Stiluri riêng —
const containerStyle = {
  position: 'relative', display: 'flex', alignItems: 'center',
  justifyContent: 'center', height: '100vh',
  background: 'linear-gradient(to bottom, #283593 0%, #ffffff 100%)',
  fontFamily: "'Poppins', sans-serif", padding: '2rem'
};
const logoStyle = {
  position: 'absolute', top: '1.5rem', left: '1.5rem'
};
const formStyle = {
  background: '#fff', borderRadius: '10px', padding: '2.5rem',
  width: '100%', maxWidth: '400px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
  display: 'flex', flexDirection: 'column', gap: '1.25rem', zIndex: 1
};
const titleStyle = {
  fontSize: '1.75rem', color: '#283593', margin: 0, textAlign: 'center'
};
const inputStyle = {
  padding: '0.75rem 1rem', fontSize: '1rem',
  border: '1px solid #DDD', borderRadius: '6px',
  outline: 'none', transition: 'border-color .2s'
};
const buttonStyle = {
  background: '#283593', color: '#fff', border: 'none',
  padding: '0.75rem', fontSize: '1rem', fontWeight: 600,
  borderRadius: '6px', cursor: 'pointer',
  transition: 'background .2s ease, transform .1s ease'
};
const errorStyle = {
  color: '#E53935', textAlign: 'center', margin: 0
};
const linkContainerStyle = {
  textAlign: 'center', fontSize: '0.9rem', color: '#555'
};
const registerLinkStyle = {
  color: '#283593', fontWeight: 500, textDecoration: 'none'
};
const homeLinkContainer = { textAlign: 'center', marginTop: '1rem' };
const homeLinkStyle = {
  display: 'inline-block', background: 'transparent', color: '#283593',
  border: '1px solid #283593', padding: '0.5rem 1rem',
  borderRadius: '6px', textDecoration: 'none',
  transition: 'background .2s, color .2s'
};
