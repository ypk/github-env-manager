var express = require("express");
var createError = require('http-errors')
var router = express.Router();

router.get("/", function (req, res, next) {
  if (req.session.user) {
    let userData = JSON.parse(req.session.user);
    res.render("index", { user: userData });
  } else {
    var message = "Unauthorized user";
    var err = createError(401, message);
    res.status(401);
    res.render('error', { error: err, message: message });
  }
});

module.exports = router;
