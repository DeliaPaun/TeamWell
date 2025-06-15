const express = require('express');
const jwt     = require('jsonwebtoken');
const auth    = require('../middlewares/auth');  
const router  = express.Router();

router.get('/embed/dashboard-token', auth, (req, res) => {
  if (!['manager','admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Acces interzis.' });
  }

  const dashboardId = Number(process.env.MB_DASHBOARD_ID);
  const payload = {
    resource: { dashboard: dashboardId },
    params: {},                                     
    exp: Math.floor(Date.now() / 1000) + 10 * 60     
  };

  const token = jwt.sign(payload, process.env.MB_EMBEDDING_SECRET);
  const embedUrl = `${process.env.MB_URL}/embed/dashboard/${dashboardId}#jwt=${token}`;

  res.json({ embedUrl });
});

module.exports = router;
