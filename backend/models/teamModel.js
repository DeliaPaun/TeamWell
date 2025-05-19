const pool = require('../db');

exports.getAllTeams = async () => {
  const res = await pool.query(
    'SELECT id, name, description, created_at FROM team ORDER BY name'
  );
  return res.rows;
};

exports.getTeamsForUser = async userId => {
  const res = await pool.query(
    `SELECT t.id, t.name, t.description, tm.joined_at
     FROM team t
     JOIN team_member tm ON t.id = tm.team_id
     WHERE tm.user_id = $1`,
    [userId]
  );
  return res.rows;
};

exports.addUserToTeam = async (userId, teamId) => {
  await pool.query(
    `INSERT INTO team_member (user_id, team_id, joined_at)
     VALUES ($1, $2, NOW())`,
    [userId, teamId]
  );
};