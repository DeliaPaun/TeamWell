import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API                from '../api';

export default function PerformanceForm() {
  const navigate = useNavigate();
  const [tasks, setTasks]     = useState('');
  const [hours, setHours]     = useState('');
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (tasks < 0 || hours < 0 || hours > 24) {
      setError('Valori invalide: ore între 0 și 24, sarcini ≥ 0.');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      await API.post('/activities', {
        userId:         user.id,
        date:           new Date().toISOString().slice(0,10),
        tasksCompleted: Number(tasks),
        hoursWorked:    Number(hours)
      });
      setSuccess('Activitate salvată cu succes!');
      setTimeout(() => navigate('/questionnaires', { state: { successMsg: 'Activitate salvată!' } }), 800);
    } catch (err) {
      console.error(err);
      setError('A apărut o eroare la salvare.');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #283593 0%, #ffffff 100%)',
      fontFamily: "'Poppins', sans-serif",
      padding: '2rem'
    }}>
      {/* Logo + TEAMWELL */}
      <div style={{
        position: 'absolute', top: '1.5rem', left: '1.5rem',
        display: 'flex', alignItems: 'center'
      }}>
        <img src="/logo.svg" alt="TeamWell" style={{ width: '200px', height: 'auto' }} />
      </div>

      <div style={{
        width: '100%', maxWidth: '400px',
        margin: '4rem auto 0',
        background: '#FFFFFF',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        zIndex: 1
      }}>
        <h2 style={{
          margin: 0,
          textAlign: 'center',
          color: '#283593',
          fontSize: '1.75rem'
        }}>
          Raportează activitate zilnică
        </h2>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap: '1.25rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', color: '#283593' }}>
            Câte sarcini ai finalizat azi?
            <input
              type="number"
              min="0"
              value={tasks}
              onChange={e => setTasks(e.target.value)}
              required
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid #DDD',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', color: '#283593' }}>
            Câte ore ai lucrat azi?
            <input
              type="number"
              min="0"
              max="24"
              step="0.25"
              value={hours}
              onChange={e => setHours(e.target.value)}
              required
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid #DDD',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              background: '#0288D1',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background .2s ease, transform .1s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0277BD'; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0288D1'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Trimite
          </button>
        </form>

        {error && (
          <p style={{ marginTop: '1rem', color: '#b71c1c', textAlign: 'center' }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ marginTop: '1rem', color: '#1b5e20', textAlign: 'center' }}>
            {success}
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link
            to="/questionnaires"
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
            onMouseEnter={e => { e.currentTarget.style.background = '#283593'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#283593'; }}
          >
            Înapoi la chestionare
          </Link>
        </div>
      </div>
    </div>
  );
}
