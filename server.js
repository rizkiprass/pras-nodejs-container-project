const express = require("express");
const app = express();
const mysql = require("mysql");

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "pras-test-mysql.cztg5toglj5t.us-west-2.rds.amazonaws.com",
  user: "admin",
  password: "kCKF1ViTW09hvtpLbB3Y",
  database: "crud-db",
});

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

// Define the route to retrieve data from the database
app.get("/db", (req, res) => {
  // Acquire a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: "Failed to connect to the database" });
      return;
    }

    // Query the database
    connection.query("SELECT * FROM movie_reviews", (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        res
          .status(500)
          .json({ error: "Failed to retrieve data from the database" });
        return;
      }

      // Return the results as JSON
      res.json({ data: results });
    });
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
