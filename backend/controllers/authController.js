const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../db');
const {
  createUser,
  findUserByEmail
} = require('../models/userModel');

exports.register = async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    role,
    teamName      
  } = req.body;

  if (password.length !== 10) {
    return res
      .status(400)
      .json({ message: 'Password must have 10 characters.' });
  }
  if (!teamName) {
    return res
      .status(400)
      .json({ message: 'teamName is required.' });
  }
  if (await findUserByEmail(email)) {
    return res
      .status(400)
      .json({ message: 'Email already in use.' });
  }

  // 1) Creare hash parolă și user nou
  const hash = await bcrypt.hash(password, 10);
  const user = await createUser(
    email,
    hash,
    first_name,
    last_name,
    role
  );

  // 2) Găsește sau creează echipa
  let teamId;
  const teamRes = await pool.query(
    `SELECT id 
       FROM team 
      WHERE name = $1`,
    [teamName]
  );

  if (teamRes.rows.length > 0) {
    teamId = teamRes.rows[0].id;
  } else {
    const insertTeam = await pool.query(
      `INSERT INTO team
         (name, description, created_at)
       VALUES ($1, $2, NOW())
       RETURNING id`,
      [
        teamName,
        `Echipa creată automat la înregistrarea lui ${first_name} ${last_name}`
      ]
    );
    teamId = insertTeam.rows[0].id;
  }

  // 3) Leagă user-ul de echipă
  await pool.query(
    `INSERT INTO team_member
       (user_id, team_id, joined_at)
     VALUES ($1, $2, NOW())`,
    [user.id, teamId]
  );

  // 4) Răspuns
  res
    .status(201)
    .json({ id: user.id, email: user.email, teamId });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      user: {
        id:         user.id,
        email:      user.email,
        first_name: user.first_name,
        last_name:  user.last_name,
        role:       user.role
      }
    });
  } catch (err) {
    console.error('[LOGIN] error:', err);
    return res.status(500).json({ error: err.message });
  }
};
