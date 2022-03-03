const config = require("../config");
const neo4j = require("neo4j-driver");

module.exports = function (app) {
  const session_bookmark = config.driver.session();

  //Get Bookmarks Route
  app.get("/bookmarks/:userId", function (req, res) {
    var userId = req.params.userId;
    var pageNumber = +req.query.pagenumber;
    var itemsPerPage = +req.query.itemsperpage;

    const query = `
      MATCH (a:User)-[r:Bookmarked]->(b:Book) 
      WHERE ID(a)=$userIdParam 
      OPTIONAL MATCH ()-[d:Rated]->(b) 
      RETURN b, avg(d.rating) AS rating 
      SKIP $skipParam 
      LIMIT $limitParam`;
    const queryParams = {
      userIdParam: +userId,
      skipParam: neo4j.int(pageNumber * itemsPerPage),
      limitParam: neo4j.int(itemsPerPage),
    };

    const queryNumberOfBooks = `
      MATCH (a:User)-[r:Bookmarked]->(b:Book) 
      WHERE ID(a)=$userIdParam 
      RETURN COUNT(b)`;
    const queryNumberOfBooksParams = {
      userIdParam: +userId,
    };

    session_bookmark
      .run(query, queryParams)
      .then(function (result) {
        session_bookmark
          .run(queryNumberOfBooks, queryNumberOfBooksParams)
          .then(function (result2) {
            var bookArr = [];
            var numberOfBooks = result2.records[0]._fields[0].low;

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

  // Add Bookmark Route
  app.post("/bookmarks", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;

    const query = `
      MATCH (a:User), (b:Book) 
      WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam 
      CREATE (a)-[r:Bookmarked]->(b) 
      RETURN r`;
    const queryParams = {
      userIdParam: +userId,
      bookIdParam: +bookId,
    };

    session_bookmark
      .run(query, queryParams)
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

    const query = `
      MATCH (a:User)-[r:Bookmarked]->(b:Book) 
      WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam 
      DELETE r`;
    const queryParams = {
      userIdParam: +userId,
      bookIdParam: +bookId,
    };

    session_bookmark
      .run(query, queryParams)
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
