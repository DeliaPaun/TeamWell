import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #283593 0%, #ffffff 100%)',
        padding: '2rem',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src="/logo.svg"
          alt="TeamWell logo"
          style={{ width: '200px', height: 'auto' }}
        />
      </div>
      <div style={{ textAlign: 'center', color: '#283593', maxWidth: '600px' }}>
        <h1
          style={{
            fontSize: '4rem',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.1,
            textTransform: 'uppercase',
          }}
        >
          TEAMWELL
        </h1>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            margin: '1rem 0 2rem',
            lineHeight: 1.3,
          }}
        >
          Platformă BI pentru gestionarea performanței
          <br />
          și monitorizarea burnout-ului
        </h2>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#283593',
            color: '#ffffff',
            border: 'none',
            padding: '0.75rem 2rem',
            fontSize: '1.125rem',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s ease-in-out',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Intră în cont
        </button>
      </div>
    </div>
  );
}
