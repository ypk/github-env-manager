var indexRouter = require("./root");
var authenticationRouter = require("./authenticate");
var environmentRouter = require("./environments");
var authorizeRouter = require("./authorize");

module.exports = {
  indexRouter,
  authenticationRouter,
  environmentRouter,
  authorizeRouter
};