var express = require("express");
var createError = require('http-errors');
var router = express.Router();
var { getRepositoriesWithDeployments } = require("../middleware");

router.get("/", function (req, res, next) {
  if (req.session.user) {
    let userData = JSON.parse(req.session.user);
    let repoData = JSON.parse(req.session.repos);
    res.render("environments", {user: userData, repos: repoData});
  } else {
    return next(createError(401, "Unauthorized Access"))
  }
});

module.exports = router;
