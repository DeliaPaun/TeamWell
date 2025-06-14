import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
      } catch {
        alert('Datele din localStorage sunt corupte.');
        navigate('/login');
      }
    } else {
      alert('Nu s-a putut încărca profilul.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    API.get(`/users/${user.id}/team`)
      .then(res => setTeam(res.data))
      .catch(err => {
        console.error('Eroare la încărcarea echipei:', err);
        setTeam(null);
      });
  }, [user]);

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #283593 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Poppins', sans-serif",
        color: '#ffffff'
      }}>
        <p>Se așteaptă profilul</p>
      </div>
    );
  }

  const { id, email, first_name, last_name, role } = user;

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #283593 0%, #ffffff 100%)',
      padding: '2rem',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <img src="/logo.svg" alt="TeamWell" style={{ width: '200px', height: 'auto' }} />
      </div>

      <div style={{
        maxWidth: '500px',
        margin: '4rem auto 0',
        background: '#FFFFFF',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          color: '#283593',
          margin: 0,
          textAlign: 'center'
        }}>
          Profil Utilizator
        </h2>

        <ProfileRow label="ID" value={id} />
        <ProfileRow label="Email" value={email} />
        <ProfileRow label="Prenume" value={first_name} />
        <ProfileRow label="Nume" value={last_name} />
        <ProfileRow label="Rol" value={role} capitalize />
        <ProfileRow label="Echipă" value={team ? team.name : 'Loading…'} />

        <button
          onClick={() => navigate('/questionnaires')}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem',
            fontSize: '1rem',
            background: '#283593',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background .2s ease, transform .1s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1A237E'}
          onMouseLeave={e => e.currentTarget.style.background = '#283593'}
        >
          Înapoi la chestionare
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ label, value, capitalize }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#333' }}>
      <strong>{label}:</strong>
      <span style={{ textTransform: capitalize ? 'capitalize' : 'none' }}>{value}</span>
    </div>
  );
}
