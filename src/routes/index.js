const users = require("./user");
const post = require("./post");
const home = require("./home");

module.exports = (app) => {
  app.use("/user", users);
  app.use("/post", post);
  app.use("/", home);
};
