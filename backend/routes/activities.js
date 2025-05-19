const express = require('express');
const router = express.Router();
const { createActivity } = require('../controllers/activitiesController');

router.post('/', createActivity);

module.exports = router;
