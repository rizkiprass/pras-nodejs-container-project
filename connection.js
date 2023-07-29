const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "master",
  password: "cl8Lgbom!V72T^1FNIxkSrnmbmIg$bjx",
  database: "telaluldb",
});

module.exports = db;
