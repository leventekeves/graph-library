const config = require("../config");

module.exports = function (app) {
  const session = config.session;

  //Get Bookmarks Route
  app.get("/bookmarks/:userId", function (req, res) {
    var userId = req.params.userId;
    session
      .run(
        "MATCH (a:User)-[r:Bookmarked]->(b:Book) WHERE ID(a)=$userIdParam OPTIONAL MATCH ()-[d:Rated]->(b) RETURN b, avg(d.rating) AS rating",
        {
          userIdParam: +userId,
        }
      )
      .then(function (result) {
        var bookArr = [];

        result.records.forEach(function (record) {
          bookArr.push({
            id: record._fields[0].identity.low,
            name: record._fields[0].properties.name,
            author: record._fields[0].properties.author,
            title: record._fields[0].properties.title,
            category: record._fields[0].properties.category,
            cover: record._fields[0].properties.cover,
            description: record._fields[0].properties.description,
            pages: record._fields[0].properties.pages,
            stock: record._fields[0].properties.stock,
            year: record._fields[0].properties.year,
            rating: record._fields[1],
          });
        });

        res.json(bookArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Add Bookmark Route
  app.post("/bookmarks", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;

    session
      .run(
        "MATCH (a:User), (b:Book) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam CREATE (a)-[r:Bookmarked]->(b) RETURN r",
        {
          userIdParam: +userId,
          bookIdParam: +bookId,
        }
      )
      .then(function (result) {
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Remove Bookmark Route
  app.delete("/bookmarks", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;

    session
      .run(
        "MATCH (a:User)-[r:Bookmarked]->(b:Book) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam DELETE r",
        {
          userIdParam: +userId,
          bookIdParam: +bookId,
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
