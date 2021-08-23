const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/", (req, res) => {
  res.send("post");
});

router.get("/create", (req, res) => {
  res.render("create-post");
});
