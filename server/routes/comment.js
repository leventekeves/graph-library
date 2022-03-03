const config = require("../config");

module.exports = function (app) {
  const session_comment = config.driver.session();

  // Get Comments Route
  app.get("/comment/:bookId", function (req, res) {
    var bookId = req.params.bookId;

    const query = `
      MATCH (a:User)-[r:Comment]->(b:Book) 
      WHERE ID(b)=$bookIdParam 
      RETURN r, a`;
    const queryParams = {
      bookIdParam: +bookId,
    };

    session_comment
      .run(query, queryParams)
      .then(function (result) {
        var commentArr = [];

        result.records.forEach(function (record) {
          commentArr.push({
            id: record._fields[0].identity.low,
            date: record._fields[0].properties.date,
            comment: record._fields[0].properties.comment,
            userId: record._fields[1].properties.name,
          });
        });

        res.json(commentArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Add Comment Route
  app.post("/comment", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var comment = req.body.comment;
    var date = req.body.date;

    const query = `
      MATCH (a:User), (b:Book) 
      WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam 
      CREATE (a)-[r:Comment {comment:$commentParam, date:$dateParam}]->(b) 
      RETURN r`;
    const queryParams = {
      userIdParam: +userId,
      bookIdParam: +bookId,
      commentParam: comment,
      dateParam: date,
    };

    session_comment
      .run(query, queryParams)
      .then(function (result) {
        if (result.records[0]._fields[0].identity.low) {
          res.sendStatus(200);
        } else {
          res.sendStatus(400);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
