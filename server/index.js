const path = require("path");
const express = require("express");

const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "../client/build")));

require("./routes/book.js")(app);
require("./routes/user.js")(app);
require("./routes/bookmarks.js")(app);
require("./routes/borrow.js")(app);
require("./routes/list.js")(app);
require("./routes/expand.js")(app);
require("./routes/historyborrow.js")(app);

//////////////////////////////////////
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
