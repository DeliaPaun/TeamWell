import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

export default function QuestionnaireList() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [results, setResults]               = useState([]);
  const [user, setUser]                     = useState(null);
  const navigate                            = useNavigate();
  const location                            = useLocation();
  const successMsg                          = location.state?.successMsg;

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    API.get('/questionnaires')
      .then(res => setQuestionnaires(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (user?.role === 'manager' || user?.role === 'admin') {
      API.get('/questionnaires/results')
        .then(res => setResults(res.data))
        .catch(err => console.error('Fetch results error:', err));
    }
  }, [user]);

  const handleLogout  = () => { localStorage.clear(); navigate('/login'); };
  const handleProfile = () => navigate('/profile');

  if (!user) return null;
  const { first_name, last_name, role } = user;
  const fullName = `${first_name || ''} ${last_name || ''}`.trim();
  const isManagerOrAdmin = role === 'manager' || role === 'admin';

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
        maxWidth: '1200px',
        margin: '4rem auto 0',
        background: '#FFFFFF',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        zIndex: 1
      }}>
        {/* Success banner */}
        {successMsg && (
          <div style={{
            padding: '1rem', background: '#e8f5e9', border: '1px solid #66bb6a',
            borderRadius: '6px', color: '#2e7d32', textAlign: 'center'
          }}>
            {successMsg}
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#283593' }}>
            Welcome, {fullName}!
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleProfile} style={{
              background: 'transparent', color: '#283593', border: '1px solid #283593',
              padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer',
              transition: 'background .2s, color .2s'
            }} onMouseEnter={e => { e.currentTarget.style.background = '#283593'; e.currentTarget.style.color = '#FFFFFF'; }}
               onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#283593'; }}>
              Profile
            </button>
            <button onClick={handleLogout} style={{
              background: '#283593', color: '#FFFFFF', border: 'none',
              padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer',
              transition: 'background .2s'
            }} onMouseEnter={e => e.currentTarget.style.background = '#1A237E'}
               onMouseLeave={e => e.currentTarget.style.background = '#283593'}>
              Logout
            </button>
          </div>
        </div>

        <p style={{ margin: 0, color: '#555' }}>
          Role: <strong>{role}</strong>
        </p>

        {/* Employee view */}
        {!isManagerOrAdmin && (
          <>
            <button onClick={() => navigate('/activities')} style={{
              background: '#0288D1', color: '#FFFFFF', border: 'none',
              padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer',
              alignSelf: 'flex-start', transition: 'background .2s'
            }} onMouseEnter={e => e.currentTarget.style.background = '#0277BD'}
               onMouseLeave={e => e.currentTarget.style.background = '#0288D1'}>
              Raportează activitate zilnică
            </button>

            <h3 style={{ color: '#283593', marginBottom: '0.5rem' }}>Available Questionnaires</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {questionnaires.map(q => (
                <li key={q.id}>
                  <Link to={`/questionnaires/${q.id}`} style={{
                    textDecoration: 'none', color: '#FFFFFF', background: '#0288D1',
                    padding: '0.75rem 1rem', display: 'block', borderRadius: '6px',
                    textAlign: 'center', transition: 'background .2s'
                  }} onMouseEnter={e => e.currentTarget.style.background = '#0277BD'}
                     onMouseLeave={e => e.currentTarget.style.background = '#0288D1'}>
                    {q.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Manager/Admin view textual only */}
        {isManagerOrAdmin && (
          <>
            <h3 style={{ color: '#283593', marginTop: 0 }}>Employees' Questionnaire Results</h3>
            <div style={{ marginTop: '1rem' }}>
              {results.length === 0 ? (
                <p style={{ color: '#555' }}>No results yet.</p>
              ) : results.map(emp => (
                <div key={emp.user_id} style={{ border: '1px solid #DDD', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 .5rem', color: '#283593' }}>{emp.name}</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {emp.results.map((r, i) => (
                      <li key={i} style={{ color: '#555', marginBottom: '0.25rem' }}>
                        <strong>{r.questionnaire}</strong> – Score: {r.score}, Risk: {r.risk_level}, Date: {r.date}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
