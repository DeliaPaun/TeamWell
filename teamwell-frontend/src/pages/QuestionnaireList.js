import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api';

export default function QuestionnaireList() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [, setAlerts] = useState([]);
  const [lastAlertTs, setLastAlertTs] = useState(null); 
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.successMsg;

  const dashboards = [
    {
      id: 'overview',
      title: 'Overview',
      url: 'https://metabase-production-1670.up.railway.app/public/dashboard/f62d4a0b-f5c7-46cf-8645-98efce443fdb'
    },
    {
      id: 'performance',
      title: 'Performance Insights',
      url: 'https://metabase-production-1670.up.railway.app/public/dashboard/0a4ac5df-9e49-4c6e-b585-be658808d6ad'
    },
    {
      id: 'burnout',
      title: 'Burnout & Well-being',
      url: 'https://metabase-production-1670.up.railway.app/public/dashboard/c16f9762-bd23-4739-9975-8d58492e9080'
    },
    {
      id: 'activity',
      title: 'Activity & Alerts',
      url: 'https://metabase-production-1670.up.railway.app/public/dashboard/8ee6b306-4cdf-4cfc-8876-e3b410a77966'
    }
  ];
  const [selectedDash, setSelectedDash] = useState(dashboards[0]);

  const employeeIds = React.useMemo(() => {
  return users
    .filter(u => typeof u.role === 'string' && u.role.toLowerCase() === 'employee')
    .map(u => u.id);
}, [users]);

  const employeeResults = React.useMemo(() => {
    return results.filter(r => employeeIds.includes(r.user_id));
  }, [results, employeeIds]);

  const activeUsers = React.useMemo(() => {
    return employeeResults.filter(r => Array.isArray(r.results) && r.results.length > 0);
  }, [employeeResults]);

  useEffect(() => {
    const raw = sessionStorage.getItem('user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    API.get('/questionnaires')
      .then(res => setQuestionnaires(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!user) return;
    const isMgr = ['manager','admin'].includes(user.role);
    if (!isMgr) return;
    Promise.all([
      API.get('/questionnaires/results'),
      API.get('/users'),
      API.get('/alerts'),
    ])
    .then(([resR, resU, resA]) => {
      setResults(resR.data);
      setUsers(resU.data);
      setAlerts(resA.data);
      if (resA.data.length) {
        setLastAlertTs(resA.data[0].created_at);
      }
    })
    .catch(console.error);
    const iv = setInterval(async () => {
      try {
        const res = await API.get('/alerts');
        const all = res.data;
        const newOnes = lastAlertTs
          ? all.filter(a => new Date(a.created_at) > new Date(lastAlertTs))
          : [];
        newOnes.forEach(a => {
          toast.info(`[${a.alert_level.toUpperCase()}] ${a.message}`, {
            position: 'top-right',
            autoClose: 60000,
          });
          if (window.Notification?.permission === 'granted') {
            new Notification('TeamWell Alert', {
              body: a.message,
              tag: `alert-${a.id}`,
            });
          }
        });
        if (all.length) {
          setLastAlertTs(all[0].created_at);
        }
      } catch (err) {
        console.error('Eroare la fetch /alerts:', err);
      }
    }, 10_000);

    return () => clearInterval(iv);
  }, [user, lastAlertTs]);

   useEffect(() => {
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleLogout  = () => { localStorage.clear(); navigate('/login'); };
  const handleProfile = () => navigate('/profile');
  if (!user) return null;

  const { first_name, last_name, role } = user;
  const fullName = `${first_name} ${last_name}`.trim();
  const isManagerOrAdmin = role === 'manager' || role === 'admin';

  //const employeeResults = results.filter(emp => usersById[emp.user_id] === 'employee');
  //const activeUsers = employeeResults.filter(emp => emp.results.length > 0);

  return (
    <div style={wrapperStyle}>
      <ToastContainer />
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
              {activeTab === 'dashboard' && (
                <>
                  <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {dashboards.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDash(d)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          border: selectedDash.id === d.id ? '2px solid #0288D1' : '1px solid #ccc',
                          background: selectedDash.id === d.id ? '#E3F2FD' : '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        {d.title}
                      </button>
                    ))}
                  </div>
                  <iframe
                    key={selectedDash.id}
                    title={selectedDash.title}
                    src={selectedDash.url}
                    width="100%"
                    height="650"
                    style={{ border: 'none' }}
                    allowTransparency
                    allowFullScreen
                  />
                </>
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
                  {employeeResults.length === 0
                    ? <p style={{ color:'#555' }}>Niciun rezultat încă.</p>
                    : employeeResults.map(emp => (
                        <div key={emp.user_id} style={resultCardStyle}>
                          <h4 style={{ margin:'0 0 .5rem', color:'#283593' }}>{emp.name}</h4>
                          <ul style={{ paddingLeft:'1.25rem' }}>
                            {emp.results.map((r,i) => {
                              const levelLabel = r.risk_level
                                ? `Risk: ${r.risk_level}`
                                : `Performance: ${r.performance_level}`;
                              return (
                                <li key={i} style={{ color:'#555', marginBottom:'0.25rem' }}>
                                  <strong>{r.questionnaire}</strong> – Score: {r.score}, {levelLabel}, Date: {r.date}
                                </li>
                              );
                            })}
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
