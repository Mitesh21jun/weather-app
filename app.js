const express = require("express");
const nunjucks = require("nunjucks");
const mysql = require("mysql2/promise");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "weather_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function getApiKey(service) {
  const [rows] = await pool.query(
    "SELECT api_key FROM api_keys WHERE service = ? ORDER BY id DESC LIMIT 1",
    [service]
  );
  return rows.length ? rows[0].api_key : null;
}

app.get("/", (req, res) => {
  res.render("index.njk");
});

app.post("/weather", async (req, res) => {
  const { address, lat, lon } = req.body;
  try {
    const apiKey = await getApiKey("openweathermap");
    if (!apiKey) return res.status(500).send("API key not set.");
    // Call OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/save", async (req, res) => {
  const { address, lat, lon, weather } = req.body;
  try {
    await pool.query(
      "INSERT INTO weather_history (address, latitude, longitude, request_time, weather_json) VALUES (?, ?, ?, NOW(), ?)",
      [address, lat, lon, JSON.stringify(weather)]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get("/history", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM weather_history ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
