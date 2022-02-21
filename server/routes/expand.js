const config = require("../config");
const neo4j = require("neo4j-driver");

module.exports = function (app) {
  const session = config.session;

  // Get ExpandBooks Route
  app.get("/expand/:pageNumber/:itemsPerPage", function (req, res) {
    var pageNumber = req.params.pageNumber;
    var itemsPerPage = req.params.itemsPerPage;

    session
      .run(
        "MATCH ()-[r:Voted]->(b:ExpandBook) RETURN b, count(r) SKIP $skipParam LIMIT $limitParam",
        {
          skipParam: neo4j.int(pageNumber * itemsPerPage),
          limitParam: neo4j.int(itemsPerPage),
        }
      )
      .then(function (result) {
        session
          .run("MATCH ()-[r:Voted]->(b:ExpandBook) RETURN count(DISTINCT(b))")
          .then(function (result2) {
            var bookArr = [];
            var numberOfBooks = result2.records[0]._fields[0].low;

            result.records.forEach(function (record) {
              bookArr.push({
                id: record._fields[0].identity.low,
                author: record._fields[0].properties.author,
                title: record._fields[0].properties.title,
                category: record._fields[0].properties.category,
                cover: record._fields[0].properties.cover,
                description: record._fields[0].properties.description,
                pages: record._fields[0].properties.pages,
                year: record._fields[0].properties.year,
                votes: record._fields[1].low,
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

  // Add ExpandBook Route
  app.post("/expand", function (req, res) {
    var author = req.body.author;
    var title = req.body.title;
    var category = req.body.category;
    var cover = req.body.cover;
    var description = req.body.description ?? "No description given";
    var pages = +req.body.pages;
    var year = +req.body.year;

    var userId = +req.body.userId;

    session
      .run(
        "MATCH (a:User) WHERE ID(a)=$userIdParam CREATE (a)-[r:Voted]->(b:ExpandBook{author:$authorParam, title:$titleParam, category:$categoryParam, cover:$coverParam, description:$descriptionParam, pages:$pagesParam, year:$yearParam})",
        {
          authorParam: author,
          titleParam: title,
          categoryParam: category,
          coverParam: cover,
          descriptionParam: description,
          pagesParam: pages,
          yearParam: year,
          userIdParam: userId,
        }
      )
      .then(function (result) {
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Add Vote Route
  app.post("/expand/vote", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;

    session
      .run(
        "MATCH (a:User), (b:ExpandBook) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam MERGE (a)-[r:Voted]->(b)",
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

  // Remove ExpandBook Route
  app.delete("/expand", function (req, res) {
    var bookId = req.body.bookId;

    session
      .run("MATCH (n:ExpandBook) WHERE ID(n)=$bookIdParam DETACH DELETE n", {
        bookIdParam: +bookId,
      })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
