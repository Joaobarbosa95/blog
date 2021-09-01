const Router = require("express-promise-router");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");
const tokenValidation = require("../middleware/jwt-validation");

const db = require("../db");
const router = new Router();

module.exports = router;

router.get("/", tokenValidation, (req, res) => {
  // req.username
  // req.userid
  res.render("user", {
    profile: {
      username: req.username,
      posts: [
        { title: "O meu pardalinho", id: 3 },
        { title: "LECAS LEQUINHAS", id: 5 },
      ],
    },
  });
});

router.get("/create", (req, res) => {
  res.status(200).render("create-user", { message: null });
});

router.post("/create", async (req, res) => {
  const { username, email, password1, password2 } = req.body;

  // Trim info and transform it case insensitive, except passoword

  try {
    // check usename, email and password
    if (username.length < 5)
      throw "Username must be at least 5 characters long";

    if (username.length > 20) throw "Username must not exceed 20 characters";

    if (password1.length < 7)
      throw "Password must be at least 8 characters long";

    if (!emailValidator.validate(email)) throw "Invalid Email";

    // Check if passwords check
    if (password1 !== password2) throw "Passwords don't match";

    // Query db for username and email collision
    const collision = await db.query(
      "SELECT * FROM author WHERE username = $1 OR email = $2",
      [username, email]
    );

    // Collision check
    if (collision.rows[0]) throw "Username or email already in use";

    // Hash password
    const hashedPassword = await bcrypt.hash(password1, 10);

    await db.query(
      "INSERT INTO author (username, email, hashed_password) VALUES($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.redirect("/");
  } catch (error) {
    res.status(401).render("create-user", { message: error });
  }
});
