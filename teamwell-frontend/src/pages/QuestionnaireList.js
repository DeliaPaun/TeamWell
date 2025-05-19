import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

const METABASE_DASHBOARD_URL =
  process.env.REACT_APP_METABASE_DASHBOARD_URL ||
  'http://localhost:3002';

export default function QuestionnaireList() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [results, setResults]               = useState([]);
  const [user, setUser]                     = useState(null);
  const navigate                            = useNavigate();
  const location                            = useLocation();
  const successMsg                          = location.state?.successMsg;

  // Preia userul din localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Preia lista de chestionare
  useEffect(() => {
    API.get('/questionnaires')
      .then(res => setQuestionnaires(res.data))
      .catch(err => console.error(err));
  }, []);

  // Preia rezultatele pentru manager/admin
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
  const fullName                        = `${first_name || ''} ${last_name || ''}`.trim();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Success banner */}
        {successMsg && (
          <div style={{
            padding: '1rem',
            background: '#e8f5e9',
            border: '1px solid #66bb6a',
            borderRadius: '4px',
            color: '#2e7d32',
            marginBottom: '1rem'
          }}>
            {successMsg}
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#6a1b9a' }}>
            Welcome, {fullName}!
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleProfile} style={{
              background: '#fff',
              color: '#6a1b9a',
              border: '1px solid #6a1b9a',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Profile
            </button>
            <button onClick={handleLogout} style={{
              background: '#6a1b9a',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </div>
        </div>

        <p style={{ margin: 0, color: '#555' }}>
          Your role: <strong>{role}</strong>
        </p>

        {/* Employee view */}
        {role === 'employee' && (
          <>
            <button onClick={() => navigate('/activities')} style={{
              background: '#6a1b9a',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}>
              Raportează activitate zilnică
            </button>

            <h3 style={{ color: '#6a1b9a' }}>Available Questionnaires</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {questionnaires.map(q => (
                <li key={q.id} style={{ margin: '0.5rem 0' }}>
                  <Link
                    to={`/questionnaires/${q.id}`}
                    style={{
                      textDecoration: 'none',
                      color: '#6a1b9a',
                      padding: '0.5rem 1rem',
                      display: 'block',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  >
                    {q.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Manager/Admin view */}
        {(role === 'manager' || role === 'admin') && (
          <>
            {/* Link către Metabase */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a
                href={METABASE_DASHBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#6a1b9a',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  marginBottom: '1rem'
                }}
              >
                Open BI Dashboard
              </a>
            </div>

            <h3 style={{ color: '#6a1b9a' }}>Employees' Questionnaire Results</h3>
            {results.length === 0 ? (
              <p style={{ color: '#555' }}>No results yet.</p>
            ) : results.map(emp => (
              <div key={emp.user_id} style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: '0 0 .5rem', color: '#333' }}>
                  {emp.name}
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {emp.results.map((r,i) => (
                    <li key={i} style={{ color: '#555', marginBottom: '0.25rem' }}>
                      <strong>{r.questionnaire}</strong> – Score: {r.score}, Risk: {r.risk_level}, Date: {r.date}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
