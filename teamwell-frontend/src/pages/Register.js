import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [form, setForm]   = useState({
    first_name: '',
    last_name:  '',
    email:      '',
    password:   '',
    teamName:   '',      
    role:       ''
  });
  const [error, setError] = useState('');
  const navigate          = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password.length !== 10) {
      setError('Parola trebuie să aibă exact 10 caractere.');
      return;
    }
    if (!form.teamName.trim()) {
      setError('Te rog să introduci numele echipei.');
      return;
    }
    if (!form.role) {
      setError('Te rog să selectezi un rol.');
      return;
    }

    try {
      await API.post('/register', form);
      alert('Înregistrare reușită! Te poți autentifica.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la înregistrare');
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
      {/* Logo + TEAMWELL în colțul din stânga-sus */}
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

      <form onSubmit={handleSubmit} style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px',
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
          Înregistrare
        </h2>

        {/* First & Last Name */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            name="first_name"
            placeholder="Prenume"
            value={form.first_name}
            onChange={handleChange}
            required
            style={{
              flex: 1,
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
            name="last_name"
            placeholder="Nume"
            value={form.last_name}
            onChange={handleChange}
            required
            style={{
              flex: 1,
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
        </div>

        {/* Email & Password */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
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
          name="password"
          type="password"
          placeholder="Parolă (10 caractere)"
          value={form.password}
          onChange={handleChange}
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

        {/* Team & Role */}
        <input
          name="teamName"
          placeholder="Nume echipă"
          value={form.teamName}
          onChange={handleChange}
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
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid #DDD',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color .2s ease'
          }}
        >
          <option value="" disabled>
            Selectează rol
          </option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

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
          Înregistrare
        </button>

        {/* Buton de revenire la Homepage */}
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
