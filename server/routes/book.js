const config = require("../config");

module.exports = function (app) {
  const session = config.session;

  // Get Books Route
  app.get("/book", function (req, res) {
    session
      .run(
        "MATCH (b:Book) OPTIONAL MATCH (a)-[r:Rated]->(b) RETURN b, avg(r.rating) AS rating"
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

  // Get Books Route, parameter gives the ID's of books that are in the choosen list
  app.get("/book/list/:booksInList", function (req, res) {
    var booksInList = req.params.booksInList.split("-").map(function (item) {
      return parseInt(item);
    });

    var querry;
    if (booksInList.length > 0) {
      querry =
        "MATCH (b:Book) WHERE NOT ID(b) IN $booksInListParam OPTIONAL MATCH (a)-[r:Rated]->(b) RETURN b, avg(r.rating) AS rating";
    } else {
      querry =
        "MATCH (b:Book) OPTIONAL MATCH (a)-[r:Rated]->(b) RETURN b, avg(r.rating) AS rating";
    }

    session
      .run(querry, { booksInListParam: booksInList })
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

  // Get Specific Book Route
  app.get("/book/:bookId", function (req, res) {
    var bookId = req.params.bookId;
    session
      .run(
        "MATCH (b:Book) WHERE ID(b)=$bookIdParam OPTIONAL MATCH (a:User)-[r:Rated]->(b:Book) RETURN b, avg(r.rating) AS rating , count(r.rating) AS numberOfRatings",
        {
          bookIdParam: +bookId,
        }
      )
      .then(function (result) {
        if (result?.records[0]?._fields[0]) {
          var bookObj = {
            id: result.records[0]._fields[0].identity.low,
            author: result.records[0]._fields[0].properties.author,
            title: result.records[0]._fields[0].properties.title,
            category: result.records[0]._fields[0].properties.category,
            cover: result.records[0]._fields[0].properties.cover,
            description: result.records[0]._fields[0].properties.description,
            pages: result.records[0]._fields[0].properties.pages,
            stock: result.records[0]._fields[0].properties.stock,
            year: result.records[0]._fields[0].properties.year,
            rating: result.records[0]._fields[1],
            numberOfRatings: result.records[0]._fields[2].low,
          };
          res.json(bookObj);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Add Book Route
  app.post("/book", function (req, res) {
    var author = req.body.author;
    var title = req.body.title;
    var category = req.body.category;
    var cover = req.body.cover;
    var description = req.body.description;
    var pages = +req.body.pages;
    var stock = +req.body.stock;
    var year = +req.body.year;

    session
      .run(
        "CREATE(n:Book{author:$authorParam, title:$titleParam, category:$categoryParam, cover:$coverParam, description:$descriptionParam, pages:$pagesParam, stock:$stockParam, year:$yearParam }) RETURN n",
        {
          authorParam: author,
          titleParam: title,
          categoryParam: category,
          coverParam: cover,
          descriptionParam: description,
          pagesParam: pages,
          stockParam: stock,
          yearParam: year,
        }
      )
      .then(function (result) {
        res.redirect("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Delete Book Route
  app.delete("/book", function (req, res) {
    var bookId = +req.body.bookId;

    session
      .run("MATCH (n:Book) WHERE ID(n)=$bookIdParam DETACH DELETE n", {
        bookIdParam: bookId,
      })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Edit Book Route
  app.put("/book", function (req, res) {
    var id = req.body.id;
    var author = req.body.author;
    var title = req.body.title;
    var category = req.body.category;
    var cover = req.body.cover;
    var description = req.body.description;
    var pages = +req.body.pages;
    var stock = +req.body.stock;
    var year = +req.body.year;

    session
      .run(
        "MATCH (n:Book) WHERE ID(n)=$idParam SET n.author=$authorParam, n.title=$titleParam, n.category=$categoryParam, n.cover=$coverParam, n.description=$descriptionParam, n.pages=$pagesParam, n.stock=$stockParam, n.year=$yearParam RETURN n",
        {
          idParam: id,
          authorParam: author,
          titleParam: title,
          categoryParam: category,
          coverParam: cover,
          descriptionParam: description,
          pagesParam: pages,
          stockParam: stock,
          yearParam: year,
        }
      )
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // Get Comments Route
  app.get("/book/comment/:bookId", function (req, res) {
    var bookId = req.params.bookId;
    session
      .run(
        "MATCH (a:User)-[r:Comment]->(b:Book) WHERE ID(b)=$bookIdParam RETURN r, a",
        {
          bookIdParam: +bookId,
        }
      )
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
  app.post("/book/comment", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var comment = req.body.comment;
    var date = req.body.date;

    session
      .run(
        "MATCH (a:User), (b:Book) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam CREATE (a)-[r:Comment {comment:$commentParam, date:$dateParam}]->(b) return r",
        {
          userIdParam: +userId,
          bookIdParam: +bookId,
          commentParam: comment,
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

  // Rate Book Route
  app.post("/book/rate", function (req, res) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var rating = req.body.rating;

    //MATCH (a:User), (b:Book) WHERE ID(a)=0 AND ID(b)=3 CREATE (a)-[r:Rating {rating:5}]->(b) return r
    session
      .run(
        "MATCH (a:User), (b:Book) WHERE ID(a)=$userIdParam AND ID(b)=$bookIdParam CREATE (a)-[r:Rated {rating:$ratingParam}]->(b) RETURN r",
        {
          userIdParam: +userId,
          bookIdParam: +bookId,
          ratingParam: +rating,
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
