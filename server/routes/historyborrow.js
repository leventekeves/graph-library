const config = require("../config");
const neo4j = require("neo4j-driver");

module.exports = function (app) {
  const session_historyborrow = config.driver.session();

  // Add Borrowed Book to History Route
  app.post("/historyborrow", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var date = req.body.date;

    session_historyborrow
      .run(
        `MATCH (a:User), (b:Book) 
        WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam 
        CREATE (a)-[t:HistoryBorrowed {date:$dateParam}]->(b) 
        RETURN t`,
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
    var pageNumber = +req.query.pagenumber;
    var itemsPerPage = +req.query.itemsperpage;

    session_historyborrow
      .run(
        `MATCH (a:User)-[r:HistoryBorrowed]->(b:Book) 
        WHERE ID(a)=$userIdParam 
        OPTIONAL MATCH ()-[d:Rated]->(b) 
        RETURN b, avg(d.rating) AS rating, r 
        SKIP $skipParam 
        LIMIT $limitParam`,
        {
          userIdParam: +userId,
          skipParam: neo4j.int(pageNumber * itemsPerPage),
          limitParam: neo4j.int(itemsPerPage),
        }
      )
      .then(function (result) {
        session_historyborrow
          .run(
            `MATCH (a:User)-[r:HistoryBorrowed]->(b:Book) 
            WHERE ID(a)=$userIdParam 
            RETURN count(*)`,
            {
              userIdParam: +userId,
            }
          )
          .then((result2) => {
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
                stock: record._fields[0].properties.stock,
                year: record._fields[0].properties.year,
                rating: record._fields[1],
                date: record._fields[2].properties.date,
              });
            });

            res.json({ booksArr: bookArr, numberOfBooks: numberOfBooks });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
