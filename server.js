'use strict';

const express = require('express');
const mysql = require('mysql');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const DB_HOST = 'pras-ecs-rds.cztg5toglj5t.us-west-2.rds.amazonaws.com';
const DB_USER = 'admin';
const DB_PASSWORD = 'FruFpmUGhxpXCHmBFjq3';
const DB_NAME = 'pras-ecs-rds';

// Create MySQL connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
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
            <h1>Hello World-v16-test</h1>
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