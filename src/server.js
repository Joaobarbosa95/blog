const express = require("express");
const path = require("path");

const mountRoutes = require("./routes");

const app = express();

mountRoutes(app);
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

const staticFiles = path.join(__dirname, "./public");
app.use(express.static(staticFiles));

app.listen(port, () => console.log("Server running on port %s", port));
