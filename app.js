const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const weatherRoutes = require('./routes/weather');
app.use('/', weatherRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
