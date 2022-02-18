const config = require("../config");

module.exports = function (app) {
  const session = config.session;

  // Add Borrowed Book to History Route
  app.post("/historyborrow", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var date = req.body.date;

    session
      .run(
        "MATCH (a:User), (b:Book) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam CREATE (a)-[t:HistoryBorrowed {date:$dateParam}]->(b) RETURN t",
        {
          userIdParam: +userId,
          bookIdParam: +bookId,
          dateParam: date,
        }
      )
      .then(function (result) {
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Get Borrowed Books from History Route
  app.get("/historyborrow/:userId", function (req, res) {
    var userId = req.params.userId;
    session
      .run(
        "MATCH (a:User)-[r:HistoryBorrowed]->(b:Book) WHERE ID(a)=$userIdParam OPTIONAL MATCH ()-[d:Rated]->(b) RETURN b, avg(d.rating) AS rating, r",
        {
          userIdParam: +userId,
        }
      )
      .then(function (result) {
        var bookArr = [];

        result.records.forEach(function (record) {
          bookArr.push({
            id: record._fields[0].identity.low,
            author: record._fields[0].properties.author,
            title: record._fields[0].properties.title,
            category: record._fields[0].properties.category,
            cover: record._fields[0].properties.cover,
            description: record._fields[0].properties.description,
            pages: record._fields[0].properties.pages,
            stock: record._fields[0].properties.stock,
            year: record._fields[0].properties.year.low,
            rating: record._fields[1],
            date: record._fields[2].properties.date,
          });
        });

        res.json(bookArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
