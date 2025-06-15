import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

export default function QuestionnaireList() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [results, setResults]               = useState([]);
  const [user, setUser]                     = useState(null);
  const [activeTab, setActiveTab]           = useState('dashboard');
  const [embedUrl, setEmbedUrl]           = useState('');
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
        .catch(err => console.error('Eroare la returnarea rezultatelor:', err));
    }
  }, [user]);

  useEffect(() => {
    if ((user?.role === 'manager' || user?.role === 'admin') && activeTab === 'dashboard') {
      API.get('/embed/dashboard-token')
        .then(res => setEmbedUrl(res.data.embedUrl))
        .catch(err => {
          console.error('Eroare la embed token:', err);
          setEmbedUrl('');
        });
    }
  }, [user, activeTab]);

  const handleLogout  = () => { localStorage.clear(); navigate('/login'); };
  const handleProfile = () => navigate('/profile');

  if (!user) return null;
  const { first_name, last_name, role } = user;
  const fullName = `${first_name} ${last_name}`.trim();
  const isManagerOrAdmin = role === 'manager' || role === 'admin';
  const activeUsers = results.filter(emp => emp.results.length > 0);

  return (
    <div style={wrapperStyle}>
      <div style={logoStyle}>
        <img src="/logo.svg" alt="TeamWell" style={{ width: '200px' }} />
      </div>
      <div style={containerStyle}>
        <div style={topBarStyle}>
          <h2 style={{ margin: 0, color: '#283593' }}>Welcome, {fullName}!</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleProfile} style={tabButtonStyle('#fff','#283593','#283593')}>Profil</button>
            <button onClick={handleLogout} style={tabButtonStyle('#283593','#fff')}>Deloghează-te</button>
          </div>
        </div>

        {isManagerOrAdmin && (
          <nav style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            {['dashboard','questionnaires','reports','users'].map(tab => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={tabStyle(tab === activeTab)}
              >
                {tabLabels[tab]}
              </div>
            ))}
          </nav>
        )}

        <div style={{ padding: '2rem' }}>
          {successMsg && <div style={successMsgStyle}>{successMsg}</div>}

          {isManagerOrAdmin ? (
            <>
              {activeTab === 'dashboard' && embedUrl && (
                <iframe
                  title="Metabase Dashboard"
                  src={embedUrl}
                  style={{ width:'100%', height:'600px', border:'none', borderRadius:'8px' }}
                  allowFullScreen
                />
              )}

              {activeTab === 'questionnaires' && (
                <>
                  <h3 style={{ color: '#283593' }}>Chestionare disponibile</h3>
                  <ul style={listGridStyle}>
                    {questionnaires.map(q => (
                      <li key={q.id}>
                        <Link to={`/questionnaires/${q.id}`} style={cardLinkStyle}>
                          {q.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {activeTab === 'reports' && (
                <>
                  <h3 style={{ color: '#283593' }}>Rezultate chestionare angajați</h3>
                  {results.length === 0
                    ? <p style={{ color:'#555' }}>Niciun rezultat încă.</p>
                    : results.map(emp => (
                        <div key={emp.user_id} style={resultCardStyle}>
                          <h4 style={{ margin:'0 0 .5rem', color:'#283593' }}>{emp.name}</h4>
                          <ul style={{ paddingLeft:'1.25rem' }}>
                            {emp.results.map((r,i) => (
                              <li key={i} style={{ color:'#555', marginBottom:'0.25rem' }}>
                                <strong>{r.questionnaire}</strong> – Score: {r.score}, Risk: {r.risk_level}, Date: {r.date}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                  }
                </>
              )}

              {activeTab === 'users' && (
                <>
                  <h3 style={{ color: '#283593' }}>Utilizatori Activi</h3>
                  {activeUsers.length === 0
                    ? <p style={{ color:'#555' }}>Niciun utilizator nu a completat încă un chestionar.</p>
                    : (
                      <ul style={{ listStyle:'none', padding:0 }}>
                        {activeUsers.map(emp => (
                          <li key={emp.user_id} style={{ padding:'0.75rem', borderBottom:'1px solid #eee' }}>
                            {emp.name} – {emp.results.length} completări
                          </li>
                        ))}
                      </ul>
                    )
                  }
                </>
              )}
            </>
          ) : (
            <>
              <button onClick={() => navigate('/activities')} style={primaryButtonStyle}>
                Raportează activitate zilnică
              </button>
              <h3 style={{ color:'#283593' }}>Chestionare disponibile</h3>
              <ul style={listGridStyle}>
                {questionnaires.map(q => (
                  <li key={q.id}>
                    <Link to={`/questionnaires/${q.id}`} style={cardLinkStyle}>
                      {q.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const wrapperStyle = {
  position: 'relative', minHeight: '100vh',
  background: 'linear-gradient(to bottom, #283593 0%, #ffffff 100%)',
  fontFamily: "'Poppins', sans-serif'", padding: '2rem'
};
const logoStyle = {
  position: 'absolute', top: '1.5rem', left: '1.5rem',
  display: 'flex', alignItems: 'center'
};
const containerStyle = {
  maxWidth: '1200px', margin: '4rem auto 0',
  background: '#fff', borderRadius: '10px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.1)', overflow: 'hidden'
};
const topBarStyle = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', padding: '1rem 2rem',
  borderBottom: '1px solid #eee'
};
const primaryButtonStyle = {
  background: '#0288D1', color: '#fff', border: 'none',
  padding: '0.75rem 1.5rem', borderRadius: '6px',
  cursor: 'pointer', transition: 'background .2s'
};
const cardLinkStyle = {
  display: 'block', textDecoration: 'none',
  background: '#0288D1', color: '#fff',
  padding: '0.75rem 1rem', borderRadius: '6px',
  textAlign: 'center', transition: 'background .2s'
};
const listGridStyle = {
  listStyle: 'none', padding: 0, margin: 0,
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
  gap: '1rem'
};
const resultCardStyle = {
  border: '1px solid #DDD', borderRadius: '6px',
  padding: '1rem', marginBottom: '1rem'
};
const successMsgStyle = {
  padding: '1rem', background: '#e8f5e9',
  border: '1px solid #66bb6a', borderRadius: '6px',
  color: '#2e7d32', marginBottom: '1rem'
};
function tabStyle(active) {
  return {
    padding: '0.75rem 1.5rem', cursor: 'pointer',
    color: active ? '#283593' : '#777',
    borderBottom: active ? '3px solid #0288D1' : '3px solid transparent',
    fontWeight: active ? 600 : 500
  };
}
const tabLabels = {
  dashboard:      'Dashboard',
  questionnaires:'Chestionare',
  reports:        'Rapoarte',
  users:          'Utilizatori'
};

/**
 * @param {string} bg          
 * @param {string} color       
 * @param {string} borderColor 
 */
function tabButtonStyle(bg = '#fff', color = '#283593', borderColor) {
  return {
    background: bg,
    color: color,
    border: `1px solid ${borderColor || color}`,
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background .2s, color .2s'
  };
}