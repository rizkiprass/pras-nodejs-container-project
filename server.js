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

    // Insert a row into mytable
    connection.query(`
      INSERT INTO mytable (name)
      VALUES ('Doe')
    `, (err) => {
      if (err) {
        console.error('Error inserting row into mytable: ', err);
        return;
      }
      console.log('Inserted row into mytable');
    });
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

    // Build the HTML response
    let html = `
      <html>
        <head>
          <title>My App - version</title>
        </head>
        <body>
          <h1>My App version - v2</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Add the results to the HTML response
    results.forEach(row => {
      html += `
        <tr>
          <td>${row.id}</td>
          <td>${row.name}</td>
        </tr>
      `;
    });

    // Close the HTML response
    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Send the response to the client
    res.send(html);
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
