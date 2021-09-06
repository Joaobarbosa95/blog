const Router = require("express-promise-router");
const db = require("../db");
const { convertIdToUsername } = require("../middleware/convertIdToUsername");

const router = new Router();

module.exports = router;

router.get("/", (req, res) => {
  res.render("search", { posts: undefined });
});

router.post("/", async (req, res) => {
  let input = req.body.search;
  input = "%" + input + "%";

  // Simple search bar
  let { rows } = await db.query(
    "SELECT * FROM posts WHERE LOWER(title) LIKE LOWER($1)",
    [input]
  );

  // need to convert author id numbers into username
  rows = await convertIdToUsername(rows);

  res.render("search", { posts: rows });
});
