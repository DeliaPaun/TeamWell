const express = require('express');
const jwt     = require('jsonwebtoken');
const auth    = require('../middlewares/auth');  
const router  = express.Router();

router.get('/embed/dashboard-token', auth, (req, res) => {
  if (!['manager','admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Acces interzis.' });
  }

  const mbUrl        = process.env.MB_URL?.replace(/\/$/, '');
  const secret       = process.env.MB_EMBEDDING_SECRET;
  const dashboardId = Number(process.env.MB_DASHBOARD_ID);
  if (!mbUrl || !secret || !dashboardId) {
    console.error('Metabase config invalidă:', { mbUrl, secret, dashboardId });
    return res.status(500).json({ message: 'Metabase nu este configurat corect.' });
  }

  const payload = {
    resource: { dashboard: dashboardId },
    params: {},                                     
    exp: Math.floor(Date.now() / 1000) + 10 * 60     
  };

  let token;
  try {
    token = jwt.sign(payload, secret);
  } catch (err) {
    console.error('Eroare la semnarea JWT Metabase:', err);
    return res.status(500).json({ message: 'Nu am putut genera token-ul.' });
  }

  const embedUrl = `${mbUrl}/embed/dashboard/${dashboardId}#jwt=${token}`;

  res.json({ embedUrl });
});

module.exports = router;
