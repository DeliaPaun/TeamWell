import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

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
      alert('Înregistrare reușită! Te poți loga.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la înregistrare');
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
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <h2 style={{ textAlign: 'center', margin: 0, color: '#6a1b9a' }}>
          Register
        </h2>

        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          title="Password must be 10 characters long."
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

        <input
          name="teamName"
          placeholder="Team Name"
          value={form.teamName}
          onChange={handleChange}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          <option value="" disabled>
            Select your role
          </option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

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
          Register
        </button>

        <p style={{ textAlign: 'center', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6a1b9a' }}>
            Login
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
          Home page
        </Link>
      </form>
    </div>
  );
}
