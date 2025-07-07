const pool = require('./db');

async function getApiKey(service) {
  const [rows] = await pool.query(
    'SELECT api_key FROM api_keys WHERE service = ? ORDER BY id DESC LIMIT 1',
    [service]
  );
  return rows.length ? rows[0].api_key : null;
}

async function saveWeatherHistory({ address, lat, lon, weather }) {
  await pool.query(
    'INSERT INTO weather_history (address, latitude, longitude, request_time, weather_json) VALUES (?, ?, ?, NOW(), ?)',
    [address, lat, lon, JSON.stringify(weather)]
  );
}

async function getWeatherHistory() {
  const [rows] = await pool.query(
    'SELECT * FROM weather_history ORDER BY created_at DESC'
  );
  return rows;
}

module.exports = {
  getApiKey,
  saveWeatherHistory,
  getWeatherHistory,
};
