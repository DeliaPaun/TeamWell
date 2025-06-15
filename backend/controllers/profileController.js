const { findUserByEmail } = require('../models/userModel');
const { getTeamsForUser } = require('../models/teamModel');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await findUserByEmail(req.user.email);
    const teams = await getTeamsForUser(userId);
    res.json({ user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role }, teams });
  } catch (err) {
    res.status(500).json({ message: 'Eroare de server', error: err.message });
  }
};