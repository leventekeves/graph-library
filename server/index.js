const path = require("path");
const express = require("express");

var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const neo4j = require("neo4j-driver");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "../client/build")));

const driver = neo4j.driver(
  "neo4j+s://373bc408.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "jWPQTxy-r-EdIqJAHglPE9fCmIRs7Rcdy-TJeEknpgg")
);
const session = driver.session();
const session2 = driver.session();
const session3 = driver.session();

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
          year: record._fields[0].properties.year.low,
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
          year: record._fields[0].properties.year.low,
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
          year: result.records[0]._fields[0].properties.year.low,
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
      "MATCH (n:Book) WHERE ID(n)=4 SET n.author=$authorParam, n.title=$titleParam, n.category=$categoryParam, n.cover=$coverParam, n.description=$descriptionParam, n.pages=$pagesParam, n.stock=$stockParam, n.year=$yearParam RETURN n",
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

// Signup User Route
app.post("/user", function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var access = "user";

  session
    .run(
      "CREATE(n:User{name:$nameParam, email:$emailParam, password:$passwordParam, access:$accessParam }) RETURN n",
      {
        nameParam: name,
        emailParam: email,
        passwordParam: password,
        accessParam: access,
      }
    )
    .then(function (result) {
      res.redirect("/");
    })
    .catch(function (error) {
      console.log(error);
    });
});

// Login User Route
app.post("/user/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  session
    .run(
      "MATCH (n:User) WHERE n.email=$emailParam OPTIONAL MATCH (n:User)-[r]->(b) RETURN n, r, b",
      {
        emailParam: email,
      }
    )
    .then(function (result) {
      if (
        result.records[0]?._fields[0]?.properties?.password &&
        result.records[0]?._fields[0]?.properties?.password === password
      ) {
        const ratingsArr = [];
        const bookmarksArr = [];
        const borrowingsArr = [];
        const recommendationArr = [];
        const votedArr = [];

        result.records.forEach(function (record) {
          if (record._fields[1].type === "Rated") {
            ratingsArr.push({
              bookId: record._fields[2].identity.low,
              rating: record._fields[1].properties.rating,
            });
          }

          if (record._fields[1].type === "Bookmarked") {
            bookmarksArr.push({
              bookId: record._fields[2].identity.low,
            });
          }

          if (record._fields[1].type === "Borrowed") {
            borrowingsArr.push({
              bookId: record._fields[2].identity.low,
            });
          }

          if (record._fields[1].type === "Recommended") {
            recommendationArr.push({
              listId: record._fields[2].identity.low,
            });
          }

          if (record._fields[1].type === "Voted") {
            votedArr.push({
              bookId: record._fields[2].identity.low,
            });
          }
        });

        res.json({
          id: result.records[0]._fields[0].identity.low,
          name: result.records[0]._fields[0].properties.name,
          access: result.records[0]._fields[0].properties.access,
          ratings: ratingsArr,
          bookmarks: bookmarksArr,
          borrowings: borrowingsArr,
          recommendations: recommendationArr,
          votes: votedArr,
          credentialsCorrect: true,
        });
      } else {
        res.json({ credentialsCorrect: false });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

// Get Users Route
app.get("/user", function (req, res) {
  session
    .run("MATCH (n:User) RETURN n")
    .then(function (result) {
      var userArr = [];

      result.records.forEach(function (record) {
        userArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          email: record._fields[0].properties.email,
        });
      });

      res.json(userArr);
    })
    .catch(function (error) {
      console.log(error);
    });
});

// Ban User Route
app.delete("/user/:userId", function (req, res) {
  var userId = req.params.userId;
  session
    .run("MATCH (n:User) WHERE ID(n)=$userIdParam DETACH DELETE n", {
      userIdParam: +userId,
    })
    .then(function (result) {
      res.json(result);
    })
    .catch(function (error) {
      console.log(error);
    });
});

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
          year: record._fields[0].properties.year.low,
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
          remainingExtensions: record._fields[2].properties.remainingExtensions,
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

//Get Lists Route
app.get("/list", function (req, res) {
  session
    .run(
      "MATCH ()-[r:Created]->(b:List) OPTIONAL MATCH (b)-[d:Contains]->(e:Book) RETURN b, r, count(e) ORDER BY ID(b)"
    )
    .then(function (result) {
      session
        .run(
          "MATCH (b:List) OPTIONAL MATCH ()-[r:Recommended]->(b) RETURN b, count(r) ORDER BY ID(b)"
        )
        .then(function (result2) {
          var listArr = [];

          for (let i = 0; i < result.records.length; i++) {
            listArr.push({
              id: result.records[i]._fields[0].identity.low,
              name: result.records[i]._fields[0].properties.name,
              description: result.records[i]._fields[0].properties.description,
              date: result.records[i]._fields[1].properties.date,
              recommendations: result2.records[i]._fields[1].low,
              numberOfBooks: result.records[i]._fields[2].low,
            });
          }

          res.json(listArr);
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
app.get("/list/:listId", function (req, res) {
  var listId = +req.params.listId;
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
          "MATCH (a:List)-[r:Contains]->(b:Book) WHERE ID(a)=$listIdParam OPTIONAL MATCH (c)-[d:Rated]->(e) RETURN b, avg(d.rating) AS rating",
          {
            listIdParam: listId,
          }
        )
        .then(function (result2) {
          var bookArr = [];

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
                year: record._fields[0].properties.year.low,
                rating: record._fields[1],
              });
            });
          }

          if (result?.records[0]?._fields[0]) {
            listArr.push({
              id: result.records[0]._fields[0].identity.low,
              name: result.records[0]._fields[0].properties.name,
              description: result.records[0]._fields[0].properties.description,
              date: result.records[0]._fields[2].properties.date,
              recommendations: result.records[0]._fields[1].low,
              books: bookArr,
            });
          }

          res.json(listArr);
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

// Get ExpandBooks Route
app.get("/expand", function (req, res) {
  session
    .run("MATCH ()-[r:Voted]->(b:ExpandBook) RETURN b, count(r)")
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
          year: record._fields[0].properties.year.low,
          votes: record._fields[1].low,
        });
      });

      res.json(bookArr);
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

  console.log(bookId);
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

//////////////////////////////////////
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
