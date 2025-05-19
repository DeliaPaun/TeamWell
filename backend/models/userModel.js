const pool = require('../db');

exports.findUserByEmail = async email => {
  const res = await pool.query(`SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1`, [email]);
  return res.rows[0];
};

exports.createUser = async (email, hash, firstName, lastName, role) => {
  const res = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, email`,
    [email, hash, firstName, lastName, role]
  );
  return res.rows[0];
};