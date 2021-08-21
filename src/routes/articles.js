const Router = require("express-promise-router");

const db = require("../db");

router = new Router();

module.exports = router;

router.get("/", (req, res) => {
  res.send("articles");
});
