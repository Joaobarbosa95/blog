const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mountRoutes = require("./routes");

const port = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mountRoutes(app);

const staticFiles = path.join(__dirname, "../public");
app.use(express.static(staticFiles));

app.listen(port, () => console.log("Server running on port %s", port));
