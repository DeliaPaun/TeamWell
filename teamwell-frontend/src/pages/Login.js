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
      const res = await API.post(`${API}/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);
      navigate('/questionnaires');
    } catch (err) {
      setError(err.response?.data?.message || 'Login invalid');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
      padding: '2rem'
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '360px',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <h2 style={{ textAlign: 'center', margin: 0, color: '#6a1b9a' }}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

        {error && (
          <p style={{ color: 'red', margin: 0, textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            background: '#6a1b9a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>

        <p style={{ textAlign: 'center', margin: 0 }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#6a1b9a' }}>
            Register
          </Link>
        </p>

        <Link
          to="/"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '1rem',
            padding: '0.5rem',
            color: '#6a1b9a',
            textDecoration: 'none',
            border: '1px solid #6a1b9a',
            borderRadius: '4px'
          }}
        >
          Home Page
        </Link>
      </form>
    </div>
  );
}
