'use strict';

const express = require('express');
const mysql = require('mysql');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// App
const app = express();
app.get('/', (req, res) => {
  // Use MySQL connection pool to execute query
  pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      res.send('Error connecting to database');
    } else {
      res.send(`
        <html>
          <head>
            <title>Hello World</title>
          </head>
          <body>
            <h1>Hello World-v19-test</h1>
            <p>The database connection test was successful: ${results[0].solution}</p>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});