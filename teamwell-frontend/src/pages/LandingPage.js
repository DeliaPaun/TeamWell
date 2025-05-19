// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #6a1b9a, #ab47bc)',
      color: 'white',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>TeamWell</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
        Platformă BI pentru Gestionarea Performanței și Monitorizarea Burnout-ului
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: 'white',
            color: '#6a1b9a',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
