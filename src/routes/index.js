const users = require("./user");
const post = require("./post");
const home = require("./home");
const login = require("./login");
const logout = require("./logout");

module.exports = (app) => {
  app.use("/user", users);
  app.use("/post", post);
  app.use("/", home);
  app.use("/login", login);
  app.use("/logout", logout);
};
