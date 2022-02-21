const config = require("../config");
const neo4j = require("neo4j-driver");

module.exports = function (app) {
  const session = config.session;
  const session2 = config.session2;

  //Get Borrowed Books Route
  app.get("/borrow/:userId/:pageNumber/:itemsPerPage", function (req, res) {
    var userId = req.params.userId;
    var pageNumber = req.params.pageNumber;
    var itemsPerPage = req.params.itemsPerPage;

    session
      .run(
        "MATCH (a:User)-[r:Borrowed]->(b:Book) WHERE ID(a)=$userIdParam OPTIONAL MATCH ()-[d:Rated]->(b) RETURN b, avg(d.rating) AS rating, r SKIP $skipParam LIMIT $limitParam",
        {
          userIdParam: +userId,
          skipParam: neo4j.int(pageNumber * itemsPerPage),
          limitParam: neo4j.int(itemsPerPage),
        }
      )
      .then(function (result) {
        session
          .run(
            "MATCH (a:User)-[r:Borrowed]->(b:Book) WHERE ID(a)=$userIdParam RETURN COUNT(b)",
            {
              userIdParam: +userId,
            }
          )
          .then(function (result2) {
            var numberOfBooks = result2.records[0]._fields[0].low;
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
                year: record._fields[0].properties.year,
                rating: record._fields[1],
                date: record._fields[2].properties.date,
                remainingExtensions:
                  record._fields[2].properties.remainingExtensions,
              });
            });

            res.json({ bookArr: bookArr, numberOfBooks: numberOfBooks });
          })
          .catch(function (error) {
            console.log(error);
          });
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

    session2
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
