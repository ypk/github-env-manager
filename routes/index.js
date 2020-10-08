var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  if (req.session.user) {
    res.redirect("/environments");
  } else {
    res.render("index");
  }
});

module.exports = router;
