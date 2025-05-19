const router = require('express').Router();
const auth = require('../middlewares/auth');
const { getProfile } = require('../controllers/profileController');

router.get('/', auth, getProfile);

module.exports = router;