const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const questionnaireRoutes = require('./routes/questionnaire');
const resultsRoutes = require('./routes/results');
const activitiesRouter = require('./routes/activities');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/questionnaires', resultsRoutes);
app.use('/api/activities', activitiesRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));