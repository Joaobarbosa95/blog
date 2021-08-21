const users = require("./user");
const articles = require("./articles");
const home = require("./home");

module.exports = (app) => {
  app.use("/user", users);
  app.use("/articles", articles);
  app.use("/", home);
};
