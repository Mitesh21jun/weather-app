// controllers/weatherController.js
const axios = require('axios');
const Weather = require('../models/weather');

exports.home = (req, res) => {
  res.render('index.njk');
};

exports.getWeather = async (req, res) => {
  const { address, lat, lon } = req.body;
  try {
    const apiKey = await Weather.getApiKey('openweathermap');
    if (!apiKey) return res.status(500).send('API key not set.');
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

exports.saveWeather = async (req, res) => {
  const { address, lat, lon, weather } = req.body;
  try {
    await Weather.saveWeatherHistory({ address, lat, lon, weather });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const rows = await Weather.getWeatherHistory();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};
