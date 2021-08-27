const Router = require("express-promise-router");

const db = require("../db");
const tokenValidation = require("../middleware/jwt-validation");

const router = new Router();

module.exports = router;

// Show logged user posts (login required)
router.get("/", tokenValidation, (req, res) => {
  res.send("post");
});

// Post creation route (login required)  -- JWT author information required
router.get("/create", tokenValidation, (req, res) => {
  res.render("create-post");
});

router.post("/create", tokenValidation, async (req, res) => {
  const { title, description, text } = req.body;
  const { userid } = req.userid;

  try {
    await db.query(
      "INSERT INTO posts (title, description, text, createdAt, author) VALUES($1, $2, $3, NOW(), $4)",
      [title, description, text, userid]
    );
    res.status(201).redirect("/");
  } catch (error) {
    console.log(error);
  }
});
