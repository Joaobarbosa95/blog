const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

module.exports = router;

// home -> show recent added posts (no login required)
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM posts ORDER By createdAt DESC LIMIT 9"
    );

    const requests = rows.map(async (row) => {
      const username = await db.query(
        "SELECT username FROM author WHERE authorId = $1",
        [row.author]
      );
      row.author = username.rows[0].username;
    });

    await Promise.all(requests);

    res.render("index", { posts: rows });
  } catch (error) {
    console.log(error);
  }
});
