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
  const userid = req.userid;

  try {
    await db.query(
      "INSERT INTO posts (title, description, text, author, createdAt) VALUES($1, $2, $3, $4, NOW())",
      [title, description, text, userid]
    );
    res.status(201).redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) throw "Invalid post id";

    const response = await db.query("SELECT * FROM posts WHERE postId=$1", [
      postId,
    ]);

    if (response.rows.length === 0) throw "Post not found";

    const post = ({
      title,
      text,
      description,
      createat,
      author,
      id: postid,
    } = response.rows[0]);

    res.status(200).render("post", { post: post });
  } catch (error) {
    res.status(401).render("post", { post: undefined });
  }
});
