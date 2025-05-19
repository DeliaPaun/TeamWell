import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

export default function Questionnaire() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]     = useState({});
  const [error, setError]         = useState('');
  const navigate                  = useNavigate();
  const location                  = useLocation();
  const user                      = JSON.parse(localStorage.getItem('user'));

  // Fetch questions
  useEffect(() => {
    API.get(`/questionnaires/${id}/questions`)
      .then(res => {
        setQuestions(res.data);
        const init = {};
        res.data.forEach(q => { init[q.id] = ''; });
        setAnswers(init);
      })
      .catch(() => setError('Could not load questions.'));
  }, [id]);

  const handleChange = (qid, val) => {
    setAnswers(prev => ({ ...prev, [qid]: val }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const payload = {
      userId:          user.id,
      questionnaireId: Number(id),
      responses: Object.entries(answers).map(([qid, ans]) => ({
        questionId: Number(qid),
        answer: ans
      }))
    };

    try {
      await API.post('/questionnaires/submit', payload);
      navigate('/questionnaires', {
        state: { successMsg: 'Chestionarul a fost trimis cu succes!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#6a1b9a', marginTop: 0 }}>Questionnaire #{id}</h2>

        {error && (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {questions.map(q => (
            <div key={q.id}>
              <label style={{ fontWeight: 'bold', color: '#333' }}>{q.text}</label>

              {q.scale_type === 'scale_1_5' && (
                <select
                  value={answers[q.id]}
                  onChange={e => handleChange(q.id, e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginTop: '0.5rem'
                  }}
                >
                  <option value="">Select</option>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              )}

              {q.scale_type === 'choice' && (
                <div style={{ marginTop: '0.5rem' }}>
                  {['Da','Nu'].map(opt => (
                    <label key={opt} style={{ marginRight: '1rem', color: '#555' }}>
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={e => handleChange(q.id, e.target.value)}
                        required
                      /> {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.scale_type === 'text' && (
                <textarea
                  value={answers[q.id]}
                  onChange={e => handleChange(q.id, e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginTop: '0.5rem'
                  }}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              background: '#6a1b9a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
