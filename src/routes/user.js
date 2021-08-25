const Router = require("express-promise-router");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");

const db = require("../db");
const router = new Router();

module.exports = router;

router.get("/", (req, res) => {
  res.send("users");
});

router.get("/create", (req, res) => {
  res.render("create-user", { error: undefined });
});

router.post("/create", async (req, res) => {
  const { username, email, password1, password2 } = req.body;
  // check usename, email and password length
  if (username.length < 5) {
    res.status(401).render("create-user", {
      error: "Username must be at least 5 characters long",
    });
    return;
  }

  if (username.length > 20) {
    res.status(401).render("create-user", {
      error: "Username must not exceed 20 characters",
    });
    return;
  }

  if (password1.length < 7) {
    res.status(401).render("create-user", {
      error: "Password must be at least 8 characters long",
    });
    return;
  }

  if (!emailValidator.validate(email)) {
    res.status(401).render("create-user", {
      error: "Invalid email",
    });
    return;
  }

  // Check if passwords check
  if (password1 !== password2) {
    res.status(401).render("create-user", { error: "Passwords don't match" });
    return;
  }

  try {
    // Query db for username and email collision
    const collision = await db.query(
      "SELECT * FROM author WHERE username = $1 OR email = $2",
      [username, email]
    );

    // Collision check
    if (collision.rows[0]) {
      res
        .status(401)
        .render("create-user", { error: "Username or email already in use" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password1, 10);

    await db.query(
      "INSERT INTO author (username, email, hashed_password) VALUES($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.status(201).redirect("/");
  } catch (error) {
    console.log(error);
  }
});
