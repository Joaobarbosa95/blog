const Router = require("express-promise-router");
const tokenValidation = require("../middleware/jwt-validation");
const router = new Router();

module.exports = router;

router.get("/", tokenValidation, (req, res) => {
  res.clearCookie("JWT_TOKEN", { path: "/" }).redirect("/login");
});
