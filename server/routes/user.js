const config = require("../config");

module.exports = function (app) {
  const session = config.session;
  const session2 = config.session;

  // Signup User Route
  app.post("/user", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var access = "user";

    //CREATE(n:User{name:$nameParam, email:$emailParam, password:$passwordParam, access:$accessParam }) RETURN n

    session
      .run(
        "MERGE (n:User {email: $emailParam}) ON CREATE SET n.name=$nameParam, n.password=$passwordParam, n.access=$accessParam, n.created = timestamp() ON MATCH SET n.alreadyexists = timestamp() RETURN n.created, n.alreadyexists",
        {
          nameParam: name,
          emailParam: email,
          passwordParam: password,
          accessParam: access,
        }
      )
      .then(function (result) {
        if (result.records[0]._fields[1]?.low) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Login User Route
  app.post("/user/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    session
      .run(
        "MATCH (n:User) WHERE n.email=$emailParam OPTIONAL MATCH (n:User)-[r]->(b) RETURN n, r, b",
        {
          emailParam: email,
        }
      )
      .then(function (result) {
        if (
          result.records[0]?._fields[0]?.properties?.password &&
          result.records[0]?._fields[0]?.properties?.password === password
        ) {
          const ratingsArr = [];
          const bookmarksArr = [];
          const borrowingsArr = [];
          const recommendationArr = [];
          const votedArr = [];
          const historyBorrowingsArr = [];

          result.records.forEach(function (record) {
            if (record._fields[1]?.type === "Rated") {
              ratingsArr.push({
                bookId: record._fields[2].identity.low,
                rating: record._fields[1].properties.rating,
              });
            }

            if (record._fields[1]?.type === "Bookmarked") {
              bookmarksArr.push({
                bookId: record._fields[2].identity.low,
              });
            }

            if (record._fields[1]?.type === "Borrowed") {
              borrowingsArr.push({
                bookId: record._fields[2].identity.low,
              });
            }

            if (record._fields[1]?.type === "Recommended") {
              recommendationArr.push({
                listId: record._fields[2].identity.low,
              });
            }

            if (record._fields[1]?.type === "Voted") {
              votedArr.push({
                bookId: record._fields[2].identity.low,
              });
            }

            if (record._fields[1]?.type === "HistoryBorrowed") {
              historyBorrowingsArr.push({
                bookId: record._fields[2].identity.low,
              });
            }
          });

          res.json({
            id: result.records[0]._fields[0].identity.low,
            name: result.records[0]._fields[0].properties.name,
            access: result.records[0]._fields[0].properties.access,
            ratings: ratingsArr,
            bookmarks: bookmarksArr,
            borrowings: borrowingsArr,
            recommendations: recommendationArr,
            votes: votedArr,
            historyBorrowings: historyBorrowingsArr,
            credentialsCorrect: true,
          });
        } else {
          res.json({ credentialsCorrect: false });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Get Users Route
  app.get("/user", function (req, res) {
    session
      .run("MATCH (n:User) RETURN n")
      .then(function (result) {
        var userArr = [];

        result.records.forEach(function (record) {
          userArr.push({
            id: record._fields[0].identity.low,
            name: record._fields[0].properties.name,
            email: record._fields[0].properties.email,
          });
        });

        res.json(userArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Ban User Route
  app.delete("/user/:userId", function (req, res) {
    var userId = req.params.userId;
    session
      .run("MATCH (n:User) WHERE ID(n)=$userIdParam DETACH DELETE n", {
        userIdParam: +userId,
      })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Change User Data Route
  app.put("/user", function (req, res) {
    var userId = req.body.userId;
    var currentPassword = req.body.currentPassword;

    session
      .run("MATCH(n:User) WHERE ID(n)=$userIdParam RETURN n", {
        userIdParam: userId,
      })
      .then(function (result) {
        if (
          result.records[0]._fields[0].properties.password === currentPassword
        ) {
          var name =
            req.body.name || result.records[0]._fields[0].properties.name;
          var email =
            req.body.email || result.records[0]._fields[0].properties.email;
          var password =
            req.body.password ||
            result.records[0]._fields[0].properties.password;

          session2
            .run(
              "MATCH(n:User) WHERE ID(n)=$userIdParam SET n.name=$nameParam, n.email=$emailParam, n.password=$passwordParam RETURN n",
              {
                userIdParam: userId,
                nameParam: name,
                emailParam: email,
                passwordParam: password,
              }
            )
            .then(function (result2) {
              res.sendStatus(200);
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          res.sendStatus(401);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
