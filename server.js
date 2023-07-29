const express = require("express");
const app = express();
const AWS = require("aws-sdk");
require("dotenv").config();
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/test", (req, res) => {
  res.send("hello test");
});

////////////////////////////Testing START//////////////////////////////////
app.get("/query", (req, res) => {
  console.log({ urlParam: req.query });
  res.send("query");
});

app.post("/login", (req, res) => {
  console.log({ requestFromOutside: req.body }); // body adalah data yg dikirm berupa json dari frontend ke backend
  res.send("login berhasil");
});

app.put("/username", (req, res) => {
  console.log({ updateData: req.body });
  res.send("update berhasil");
});
app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.get("/response", (req, res) => {
  response(200, "ini data", "ini message", res);
});

///////////////////////////Testing END///////////////////////////////////

///////////////// DB START //////////////////////////

/* // Define the route to retrieve data from the database
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
}); */

app.get("/db", (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, result) => {
    /* check error use if (err) (shift+alt+A) */
    // if (err) {
    //   console.error("Error executing query:", err);
    //   return res
    //     .status(500)
    //     .send("An error occurred while fetching data from the database.");
    // }

    //hasil data dari mysql
    console.log(result);
    // res.send(result);

    response(200, result, "get all data from user", res);
    // res disini untuk kirim ke res yg ada di atas app.get("/db", (req, res)
  });
});

/* query */
app.get("/find", (req, res) => {
  const sql = `SELECT name FROM user WHERE user_id = ${req.query.user_id}`; //${req.query.user_id} adalah hasil dari browser http://localhost:8080/find?user_id=123

  // console.log("find user: ", req.query.user_id);

  db.query(sql, (error, result) => {
    response(200, result, "find user name", res);
  });
});

/* params */
app.get("/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const sql = `SELECT * FROM user WHERE user_id = ${user_id}`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    // console.log(fields); // selalu test menggunakan console.log terlebih dahulu
    response(200, fields, "get user id", res);
  });
  // response(200, `user by id ${user_id}`, "get user id", res); //testing
});

/* post */
// app.post("/user", (req, res) => {
//   const { user_id, name, address } = req.body;

//   const sql = `INSERT INTO user (user_id, name, address) VALUES (${user_id}, '${name}', '${address}')`;
//   db.query(sql, (err, fields) => {
//     if (err) response(500, "invalid", "error", res);
//     if (fields?.affectedRows) {
//       const data = {
//         isSuccess: fields.affectedRows,
//         id: fields.insertId,
//       };
//       response(200, data, "data added successfuly", res);
//     }
//   });
//   // res.send("ok");
//   // response(200, "posting", "data added successfuly", res);
// });

/* put */
app.put("/user", (req, res) => {
  const { user_id, name, address } = req.body;
  const sql = `UPDATE user SET name = "${name}", address = "${address}" WHERE user_id = ${user_id}`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "Update data successfuly", res);
    } else {
      response(404, "user not found", "error", res);
    }
    console.log(fields);
  });
});

/* delete */
app.delete("/user", (req, res) => {
  const { user_id } = req.body;
  const sql = `DELETE FROM user WHERE user_id = ${user_id}`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows,
      };
      response(200, data, "Delete data successfuly", res);
    } else {
      response(404, "user not found", "error", res);
    }
  });
});

///////////////// DB END //////////////////////////

///////////////// S3 START //////////////////////////

/* Configure AWS with your credentials */
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1", // e.g., 'us-east-1'
});

// Create an S3 service object
const s3 = new AWS.S3();

// Define a route to fetch the pre-signed URL for the image in the "images/" folder in S3
app.get("/api/images/popcat", (req, res) => {
  const bucketName = "pras-infra-245";
  const folderName = "images/";
  const objectKey = "popcat-pixel.jpg";

  // Parameters to get the pre-signed URL for the image
  const params = {
    Bucket: bucketName,
    Key: folderName + objectKey,
    Expires: 3600, // The URL will expire after 1 hour (3600 seconds)
  };

  // Generate the pre-signed URL for the image
  const url = s3.getSignedUrl("getObject", params);

  res.json({ url });
});

///////////////// S3 END //////////////////////////

app.listen(8080, () => {
  console.log("Server started on port 8080");
});

// const port = 8080;
// app.listen(port, () => console.log(`Server running on port ${port}`));
