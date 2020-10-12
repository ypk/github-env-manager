const express = require("express");
const router = express.Router();
const createError = require("http-errors");

router.get("/", function (req, res, next) {
  if (req.session.user) {
    if (req.session.pat) {
      res.redirect("/environments");
    } else {
      const userData = JSON.parse(req.session.user);
      res.render("authorize", { user: userData });
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
});


router.post("/", function (req, res, next) {
  if (req.session.user) {
    if (req.session.pat) {
      res.redirect("/environments");
    } else {
      if(req.body.pat) {
        req.session.pat = req.body.pat;
        req.app.locals.pat = req.body.pat;
      }
      res.redirect("/environments");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
});
module.exports = router;
