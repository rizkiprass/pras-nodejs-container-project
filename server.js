'use strict';

const express = require('express');
const mysql = require('mysql');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// MySQL config
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL as ID ', connection.threadId);

  // Create the mytable table
  connection.query(`
    CREATE TABLE mytable (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    );
  `, (err) => {
    if (err) {
      console.error('Error creating mytable table: ', err);
      return;
    }
    console.log('Created mytable table');
  });
});


// App
const app = express();
app.get('/', (req, res) => {
  // Query the MySQL database
  connection.query('SELECT * FROM mytable', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).send('Error executing MySQL query');
      return;
    }
    // Send the query results as a response
    res.send(`
      <html>
        <head>
          <title>Hello World</title>
        </head>
        <body>
          <h1>version-17-test-reverted</h1>
          <pre>${JSON.stringify(results, null, 2)}</pre>
        </body>
      </html>
    `);
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});