// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';               // adaugă importul

export default function Profile() {
  const [user, setUser]   = useState(null);
  const [team, setTeam]   = useState(null);   // <--- nou
  const navigate          = useNavigate();

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

  // după ce avem user, facem request pentru echipa lui
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
        background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2 style={{
          margin: 0,
          textAlign: 'center',
          color: '#6a1b9a'
        }}>
          User profile
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>ID:</strong>
          <span>{user.id}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>First Name:</strong>
          <span>{user.first_name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Last Name:</strong>
          <span>{user.last_name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Role:</strong>
          <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Team:</strong>
          <span>{team ? team.name : 'Loading…'}</span>
        </div>

        <button
          onClick={() => navigate('/questionnaires')}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem',
            fontSize: '1rem',
            background: '#6a1b9a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go back
        </button>
      </div>
    </div>
  );
}
