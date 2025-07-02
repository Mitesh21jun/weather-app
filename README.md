# Weather App

A Node.js + Express.js web application that allows users to search for weather information using the OpenWeatherMap API, store and retrieve search history in MySQL, and display results using Nunjucks templates. Frontend uses Bootstrap 4.3.1 and latest jQuery. No frontend JS frameworks are used.

## Features
- Enter an address to get current weather and hourly forecast (OpenWeatherMap API)
- Store and retrieve search history in MySQL
- Dynamic HTML updates
- Credentials/API keys are NOT committed to the repo
- Database backup script included


## Setup
1. Install Node.js and MySQL
2. Clone this repo
3. Run `npm install`
4. Set up your MySQL database (see `/db/` for schema and backup)
5. Configure environment variables (see below)
6. Add your OpenWeatherMap API key to the database
7. Run the app: `npm start`

## Environment Variables
Create a `.env` file in the project root with the following content:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=weather_app
```

## Requirements
- Node.js
- Express.js
- Nunjucks
- MySQL
- Bootstrap 4.3.1
- jQuery (latest)

## Notes
- See `.gitignore` and `/db/backup.sql` for details.
