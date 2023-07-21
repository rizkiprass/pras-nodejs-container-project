const express = require("express");
const app = express();
const mysql = require("mysql");
const AWS = require("aws-sdk");
require("dotenv").config();

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

// Configure AWS with your credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1", // e.g., 'us-east-1'
});

// Create an S3 service object
const s3 = new AWS.S3();

// Define a route to fetch image URLs from S3
app.get("/api/images", (req, res) => {
  const bucketName = "rp-project";
  const prefix = "images/"; // If images are in a specific folder inside the bucket

  // Parameters to list objects in the bucket
  const params = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  // Fetch object URLs from S3
  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error("Error fetching images from S3:", err);
      res.status(500).json({ error: "Failed to fetch images from S3" });
    } else {
      const urls = data.Contents.map((obj) =>
        s3.getSignedUrl("getObject", { Bucket: bucketName, Key: obj.Key })
      );
      res.json({ urls });
    }
  });
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
