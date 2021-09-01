const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.JWT_TOKEN;

  if (token == null)
    return res.status(401).render("login", { message: "You are not logged" });

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, result) => {
    if (err) return res.status(403).redirect("/login");
    req.username = result.username;
    req.userid = result.authorId;
    next();
  });
};
