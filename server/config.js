const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "neo4j+s://373bc408.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "jWPQTxy-r-EdIqJAHglPE9fCmIRs7Rcdy-TJeEknpgg")
);

module.exports.session = driver.session();
module.exports.session2 = driver.session();
