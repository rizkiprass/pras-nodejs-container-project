const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const mysql = require("mysql");

//create connection to db
const db = mysql.createPool({
  host: "pras-test-mysql.cztg5toglj5t.us-west-2.rds.amazonaws.com",
  user: "admin",
  password: "kCKF1ViTW09hvtpLbB3Y",
  database: "crud-db",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//send data from db to backend
app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM movie_reviews";
  db.query(sqlSelect, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//send data, backend to DB
app.post("/api/insert", (req, res) => {
  const movieName = req.body.movieName; //req = menerima request dari frontend yaitu movieName
  const movieReview = req.body.movieReview;

  const sqlInsert =
    "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?);";
  db.query(sqlInsert, [movieName, movieReview], (err, result) => {
    console.log(result);
  });
});

//update data, backend to DB
app.put("/api/update", (req, res) => {
  const name = req.body.movieName; //req = menerima request dari frontend yaitu movieName
  const review = req.body.movieReview;

  const sqlUpdate =
    "UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?";
  db.query(sqlUpdate, [review, name], (err, result) => {
    if (err) console.log(err);
  });
});

//delete data
app.delete("/api/delete/:movieName", (req, res) => {
  const name = req.params.movieName;
  const sqlDelete = "DELETE FROM movie_reviews WHERE movieName = ?";

  db.query(sqlDelete, name, (err, result) => {
    if (err) console.log(err);
  });
});

//create basic json api
app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
