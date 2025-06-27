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
    try {
      const res = await API.post('/login', { email, password });
      const { token, user } = res.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('role', user.role);
      navigate('/questionnaires');
    } catch (err) {
      setError(err.response?.data?.message || 'Date invalide');
    }
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(to bottom, #283593 0%, #ffffff 100%)',
      fontFamily: "'Poppins', sans-serif",
      padding: '2rem'
    }}>
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <img
          src="/logo.svg"
          alt="TeamWell logo"
          style={{ width: '250px', height: 'auto' }}
        />
      </div>
      <form onSubmit={handleLogin} style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          color: '#283593',
          margin: 0,
          textAlign: 'center'
        }}>
          Autentificare
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid #DDD',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color .2s ease'
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#283593')}
          onBlur={e => (e.currentTarget.style.borderColor = '#DDD')}
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid #DDD',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color .2s ease'
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#283593')}
          onBlur={e => (e.currentTarget.style.borderColor = '#DDD')}
        />
        {error && (
          <p style={{ color: '#E53935', textAlign: 'center', margin: 0 }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          style={{
            background: '#283593',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background .2s ease, transform .1s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1A237E';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#283593';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Intră în cont
        </button>
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#555' }}>
            Nu ai cont?{' '}
            <Link to="/register" style={{ color: '#283593', fontWeight: 500 }}>
              Creează cont
            </Link>
          </span>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: '#283593',
              border: '1px solid #283593',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'background .2s ease, color .2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#283593';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#283593';
            }}
          >
            Pagina Principală
          </Link>
        </div>
      </form>
    </div>
  );
}
