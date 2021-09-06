const Router = require("express-promise-router");
const db = require("../db");
const { convertIdToUsername } = require("../middleware/convertIdToUsername");

const router = new Router();

module.exports = router;

// home -> show recent added posts (no login required)
router.get("/", async (req, res) => {
  try {
    let { rows } = await db.query(
      "SELECT * FROM posts ORDER By createdAt DESC LIMIT 9"
    );

    rows = await convertIdToUsername(rows);

    res.render("index", { posts: rows });
  } catch (error) {
    console.log(error);
  }
});
