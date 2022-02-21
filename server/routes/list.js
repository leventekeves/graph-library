const config = require("../config");
const neo4j = require("neo4j-driver");

module.exports = function (app) {
  const session = config.session;
  const session2 = config.session2;
  const session3 = config.session3;

  //Get Lists Route
  app.get("/list/:pageNumber/:itemsPerPage", function (req, res) {
    const sort = req.query.sort;

    var pageNumber = req.params.pageNumber;
    var itemsPerPage = req.params.itemsPerPage;

    var query =
      "MATCH ()-[r:Created]->(b:List) MATCH (b)-[d:Contains]->(e:Book) OPTIONAL MATCH ()-[t:Recommended]->(b) RETURN  b, r,  count(distinct(e)) as numberOfBooks, count(distinct(t)) as numberOfRecommendations";

    if (sort === "newest") query = query + " ORDER BY(r.date) DESC";
    if (sort === "oldest") query = query + " ORDER BY(r.date)";
    if (sort === "recommendations")
      query = query + " ORDER BY(numberOfRecommendations) DESC";

    query = query + " SKIP $skipParam LIMIT $limitParam";

    session
      .run(query, {
        skipParam: neo4j.int(pageNumber * itemsPerPage),
        limitParam: neo4j.int(itemsPerPage),
      })
      .then(function (result) {
        session2
          .run(
            "MATCH ()-[r:Created]->(b:List)-[d:Contains]->(e:Book) RETURN COUNT(DISTINCT(b))"
          )
          .then(function (result2) {
            var numberOfLists = result2.records[0]._fields[0].low;

            var listArr = [];

            for (let i = 0; i < result.records.length; i++) {
              listArr.push({
                id: result.records[i]._fields[0].identity.low,
                name: result.records[i]._fields[0].properties.name,
                description:
                  result.records[i]._fields[0].properties.description,
                date: result.records[i]._fields[1].properties.date,
                recommendations: result.records[i]._fields[3].low,
                numberOfBooks: result.records[i]._fields[2].low,
              });
            }

            res.json({ listArr: listArr, numberOfLists: numberOfLists });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Get User's Lists Route
  app.get("/list/user/:userId", function (req, res) {
    var userId = req.params.userId;
    session2
      .run(
        "MATCH (a:User)-[r:Created]->(b:List) WHERE ID(a)=$userIdParam OPTIONAL MATCH ()-[d:Recommended]->(b) RETURN b, count(d) AS Recommendations, r",
        {
          userIdParam: +userId,
        }
      )
      .then(function (result) {
        var listArr = [];

        result.records.forEach(function (record) {
          listArr.push({
            id: record._fields[0].identity.low,
            name: record._fields[0].properties.name,
            description: record._fields[0].properties.description,
            date: record._fields[2].properties.date,
            recommendations: record._fields[1],
          });
        });

        res.json(listArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Get Specific List
  app.get("/list/:listId/:pageNumber/:itemsPerPage", function (req, res) {
    var listId = +req.params.listId;
    var pageNumber = req.params.pageNumber;
    var itemsPerPage = req.params.itemsPerPage;

    session3
      .run(
        "MATCH ()-[r:Created]->(b:List)-[d:Contains]->(e:Book) WHERE ID(b)=$listIdParam OPTIONAL MATCH ()-[f:Recommended]->(b) RETURN b, count(f) AS Recommendations, r, e",
        {
          listIdParam: listId,
        }
      )
      .then(function (result) {
        var listArr = [];

        session
          .run(
            "MATCH (a:List)-[r:Contains]->(b:Book) WHERE ID(a)=$listIdParam OPTIONAL MATCH (c)-[d:Rated]->(b) RETURN b, avg(d.rating) AS rating SKIP $skipParam LIMIT $limitParam",
            {
              listIdParam: listId,
              skipParam: neo4j.int(pageNumber * itemsPerPage),
              limitParam: neo4j.int(itemsPerPage),
            }
          )
          .then(function (result2) {
            session
              .run(
                "MATCH (a:List)-[r:Contains]->(b:Book) WHERE ID(a)=$listIdParam RETURN count(b) AS numberOfBooks",
                {
                  listIdParam: listId,
                }
              )
              .then(function (result3) {
                var bookArr = [];
                var numberOfBooks = result3.records[0]._fields[0].low;

                if (result2?.records[0]?._fields[0]) {
                  result2.records.forEach(function (record) {
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
                }

                if (result?.records[0]?._fields[0]) {
                  listArr.push({
                    id: result.records[0]._fields[0].identity.low,
                    name: result.records[0]._fields[0].properties.name,
                    description:
                      result.records[0]._fields[0].properties.description,
                    date: result.records[0]._fields[2].properties.date,
                    recommendations: result.records[0]._fields[1].low,
                    books: bookArr,
                  });
                }

                res.json({ listArr: listArr, numberOfBooks: numberOfBooks });
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Create List Route
  app.post("/list", function (req, res) {
    var userId = req.body.userId;
    var date = req.body.date;
    var name = req.body.name;
    var description = req.body.description;

    session
      .run(
        "MATCH (a:User) WHERE ID(a)=$userIdParam CREATE (a)-[r:Created {date:$dateParam}]->(b:List {name:$nameParam, description:$descriptionParam})",
        {
          userIdParam: userId,
          dateParam: date,
          nameParam: name,
          descriptionParam: description,
        }
      )
      .then(function (result) {
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Delete List Route
  app.delete("/list", function (req, res) {
    var listId = +req.body.listId;

    session
      .run("MATCH (n:List) WHERE ID(n)=$listIdParam DETACH DELETE n", {
        listIdParam: listId,
      })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Add Book to List Route
  app.post("/list/book", function (req, res) {
    var listId = req.body.listId;
    var bookId = req.body.bookId;

    session
      .run(
        "MATCH (a:List),(b:Book) WHERE ID(a)=$listIdParam AND ID(b)=$bookIdParam CREATE (a)-[r:Contains]->(b)",
        {
          listIdParam: +listId,
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

  //Remove Book from List Route
  app.delete("/list/book", function (req, res) {
    var listId = req.body.listId;
    var bookId = req.body.bookId;

    session
      .run(
        "MATCH (a:List)-[r:Contains]->(b:Book) WHERE ID(a)=$listIdParam AND ID(b)=$bookIdParam DELETE r",
        {
          listIdParam: +listId,
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

  //Add Recommendation Route
  app.post("/list/recommendation", function (req, res) {
    var userId = req.body.userId;
    var listId = req.body.listId;

    session
      .run(
        "MATCH (a:User), (b:List) WHERE ID(a)=$userIdParam AND ID(b)=$listIdParam CREATE (a)-[r:Recommended]->(b)",
        {
          userIdParam: +userId,
          listIdParam: +listId,
        }
      )
      .then(function (result) {
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
