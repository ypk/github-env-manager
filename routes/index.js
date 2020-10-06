const e = require("express");
const { request } = require("express");
var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  if (req.session.user) {
    let userData = JSON.parse(req.session.user);
    res.render("index", { user: userData });
  } else {
    res.render("index");
  }
});

module.exports = router;
