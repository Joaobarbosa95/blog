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

router.post("/new-post", async (req, res) => {
  const { title, description, text } = req.query;
  try {
    await db.query(
      "INSERT INTO posts (title, description, text, createdAt) VALUES($1, $2, $3, NOW(), $4)",
      [title, description, text, 1] // Author example just for test
    );
    res.status(201).redirect("/");
  } catch (error) {
    console.log(error);
  }
});
