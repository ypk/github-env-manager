const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  if (req.session.user) {
    if(req.session.pat) {
      res.redirect("/environments");
    } else {
      res.redirect("/authorize");
    }
  } else {
    res.render("index");
  }
});

module.exports = router;
