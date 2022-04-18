const neo4j = require("neo4j-driver");

const uri = "neo4j+s://373bc408.databases.neo4j.io";
const username = "neo4j";
const password = "jWPQTxy-r-EdIqJAHglPE9fCmIRs7Rcdy-TJeEknpgg";

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

module.exports.driver = driver;
