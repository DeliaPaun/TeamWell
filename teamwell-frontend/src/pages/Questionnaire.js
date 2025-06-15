import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Questionnaire() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]     = useState({});
  const [error, setError]         = useState('');
  const navigate                  = useNavigate();

  useEffect(() => {
    API.get(`/questionnaires/${id}/questions`)
      .then(res => {
        setQuestions(res.data);
        const init = {};
        res.data.forEach(q => init[q.id] = '');
        setAnswers(init);
      })
      .catch(() => setError('Nu s-au putut încărca întrebările.'));
  }, [id]);

  const handleChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const user = JSON.parse(localStorage.getItem('user'));
    const payload = {
      userId:          user.id,
      questionnaireId: Number(id),
      responses: Object.entries(answers).map(([qid, ans]) => ({
        questionId: Number(qid),
        answer: ans === 'Da' ? 1 : ans === 'Nu' ? 0 : ans
      }))
    };

    try {
      await API.post(`/questionnaires/${id}/submit`, payload);
      navigate('/questionnaires', {
        state: { successMsg: 'Chestionarul a fost trimis cu succes!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la trimiterea chestionarului.');
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
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <img
          src="/logo.svg"
          alt="TeamWell"
          style={{ width: '200px', height: 'auto' }}
        />
      </div>

      <div style={{
        maxWidth: '600px',
        margin: '4rem auto 0',
        background: '#FFFFFF',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        zIndex: 1
      }}>
        <h2 style={{
          color: '#283593',
          marginTop: 0,
          textAlign: 'center'
        }}>
          Chestionar #{id}
        </h2>

        {error && (
          <p style={{
            color: '#E53935',
            textAlign: 'center',
            margin: '1rem 0'
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {questions.map(q => (
            <div key={q.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{
                fontWeight: 600,
                color: '#333',
                marginBottom: '0.5rem'
              }}>
                {q.text}
              </label>

              {q.scale_type === 'scale_1_5' && (
                <select
                  value={answers[q.id]}
                  onChange={e => handleChange(q.id, e.target.value)}
                  required
                  style={{
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    borderRadius: '6px',
                    border: '1px solid #DDD'
                  }}
                >
                  <option value="">Selectează</option>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              )}

              {q.scale_type === 'choice' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Da','Nu'].map(opt => (
                    <label key={opt} style={{ color: '#555' }}>
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={e => handleChange(q.id, e.target.value)}
                        required
                      />{' '}{opt}
                    </label>
                  ))}
                </div>
              )}

              {q.scale_type === 'text' && (
                <textarea
                  value={answers[q.id]}
                  onChange={e => handleChange(q.id, e.target.value)}
                  required
                  rows={4}
                  style={{
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    borderRadius: '6px',
                    border: '1px solid #DDD'
                  }}
                />
              )}
            </div>
          ))}

          <button type="submit" style={{
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

          <Link to="/questionnaires" style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: '#283593',
            textDecoration: 'none',
            fontSize: '0.9rem',
            border: '1px solid #283593',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            display: 'inline-block',
            transition: 'background .2s, color .2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#283593'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#283593'; }}
          >
            Înapoi la chestionare
          </Link>
        </form>
      </div>
    </div>
  );
}
