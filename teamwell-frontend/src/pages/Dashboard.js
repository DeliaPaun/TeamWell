import { useEffect, useState } from 'react';
import API from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [burnoutData, setBurnoutData] = useState([]);

  useEffect(() => {
    API.get('/questionnaires/scores')
      .then(res => setBurnoutData(res.data))
      .catch(() => alert('Eroare la date dashboard'));
  }, []);

  return (
    <div>
      <h2>Dashboard Performanță și Burnout</h2>
      <BarChart width={600} height={300} data={burnoutData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" />
      </BarChart>
    </div>
  );
}