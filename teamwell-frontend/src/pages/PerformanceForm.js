// src/pages/PerformanceForm.jsx
import React, { useState } from 'react';
import { useNavigate }    from 'react-router-dom';
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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6a1b9a, #9c27b0)',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#f3e5f5',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          marginBottom: '1.5rem',
          color: '#4a148c',
          textAlign: 'center'
        }}>
          Raportează activitate zilnică
        </h2>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap: '1.25rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', color: '#4a148c' }}>
            Câte sarcini ai finalizat azi?
            <input
              type="number"
              min="0"
              value={tasks}
              onChange={e => setTasks(e.target.value)}
              required
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ce93d8',
                outline: 'none',
                cursor: 'text'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', color: '#4a148c' }}>
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
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ce93d8',
                outline: 'none',
                cursor: 'text'
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              padding: '0.75rem',
              background: '#4a148c',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
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
      </div>
    </div>
  );
}
