const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Eroare la distrugerea sesiunii:', err);
      return res.status(500).json({ message: 'Eroare la logout' });
    }
    res.clearCookie('connect.sid'); // Asigură-te că numele cookie-ului corespunde cu cel setat în express-session
    res.status(200).json({ message: 'Delogare cu succes' });
  });
});

module.exports = router;
