const path = require("path");
const express = require("express");

var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const neo4j = require("neo4j-driver");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "../client/build")));

const driver = neo4j.driver(
  "neo4j+s://2ec4d09b.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "neo4j")
);
const session = driver.session();

//Test route
app.get("/api", (req, res) => {
  session
    .run("MATCH (n:Person) RETURN n")
    .then(function (result) {
      var personArr = [];

      result.records.forEach(function (record) {
        console.log(record._fields[0]);
        personArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
        });
      });

      res.json({ message: personArr[0].name });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/api2", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
