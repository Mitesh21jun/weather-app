const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/', weatherController.home);
router.post('/weather', weatherController.getWeather);
router.post('/save', weatherController.saveWeather);
router.get('/history', weatherController.getHistory);

module.exports = router;
