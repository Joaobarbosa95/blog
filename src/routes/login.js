const Router = require("express-promise-router");
const jwt = require("jsonwebtoken");
const db = require("../db");
const bcrypt = require("bcrypt");

const router = new Router();
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

module.exports = router;

router.get("/", (req, res) => {
  const token = req.cookies.JWT_TOKEN;

  if (token) {
    res.redirect("/user");
  } else {
    res.status(200).render("login", { message: undefined });
  }
});

// Login handler
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await db.query(
      "SELECT authorId, username, hashed_password FROM author WHERE username = $1",
      [username]
    );

    if (rows.length === 0) throw "Username not found";

    const hashedPassword = rows[0].hashed_password;

    const result = await bcrypt.compare(password, hashedPassword);

    if (!result) throw "Incorrect password";

    // add JWT to tokens table
    const payload = {
      username: rows[0].username,
      authorId: rows[0].authorid,
    };

    const token = jwt.sign(payload, JWT_TOKEN_SECRET, {
      algorithm: "HS256",
    });

    res.setHeader("set-cookie", [
      `JWT_TOKEN=${token}; httponly; samesite: lax`,
    ]);

    res.redirect("/user");
  } catch (error) {
    res.status(401).render("login", { message: error });
  }
});
