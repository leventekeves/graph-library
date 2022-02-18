const config = require("../config");

module.exports = function (app) {
  const session = config.session;
  //Get Borrowed Books Route
  app.get("/borrow/:userId", function (req, res) {
    var userId = req.params.userId;
    session
      .run(
        "MATCH (a:User)-[r:Borrowed]->(b:Book) WHERE ID(a)=$userIdParam OPTIONAL MATCH ()-[d:Rated]->(b) RETURN b, avg(d.rating) AS rating, r",
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
            remainingExtensions:
              record._fields[2].properties.remainingExtensions,
          });
        });

        res.json(bookArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Add Borrowed Book Route
  app.post("/borrow", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var date = req.body.date;
    var remainingExtensions = 2;

    session
      .run(
        "MATCH (a:User), (b:Book) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam CREATE (a)-[r:Borrowed {date:$dateParam, remainingExtensions:$remainingExtensionsParam }]->(b) RETURN r",
        {
          userIdParam: +userId,
          bookIdParam: +bookId,
          dateParam: date,
          remainingExtensionsParam: remainingExtensions,
        }
      )
      .then(function (result) {
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Extend Borrow Route
  app.post("/borrow/extend", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var date = req.body.newDate;

    session
      .run(
        "MATCH (a:User)-[r:Borrowed]->(b:Book) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam SET r.remainingExtensions=r.remainingExtensions-1, r.date=$dateParam RETURN r",
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

  //Remove Borrow Route
  app.delete("/borrow", function (req, res) {
    var userId = +req.body.userId;
    var bookId = +req.body.bookId;

    session
      .run(
        "MATCH (a:User)-[r:Borrowed]->(b:Book) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam DELETE r",
        {
          userIdParam: userId,
          bookIdParam: bookId,
        }
      )
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
