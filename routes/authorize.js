const express = require("express");
const router = express.Router();
const { authorizer } = require("../middleware");

router.get("/", authorizer, function (req, res, next) {
  const userData = JSON.parse(req.session.user);
  res.render("authorize", { user: userData });
});

router.post("/", function (req, res, next) {
  if (req.body.pat) {
    req.session.pat = req.body.pat;
    req.app.locals.pat = req.body.pat;
  }
  res.redirect("/environments");
});

module.exports = router;
