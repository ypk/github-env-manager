const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const { getDeployments } = require("../middleware");

router.get("/", function (req, res, next) {
  if (req.session.user) {
    if(req.session.pat) {
      const userData = JSON.parse(req.session.user);
      const repoData = JSON.parse(req.session.repos);
      const message =
        "We've found the following repositories associated with your account";
      res.render("environments", {
        user: userData,
        repos: repoData,
        message: message,
        pat: req.session.pat
      });
    }else {
      res.redirect("/authorize");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
});

router.get("/manage/:repoId", async function (req, res, next) {
  if (req.session.user) {
    const userData = JSON.parse(req.session.user);
    const repoData = JSON.parse(req.session.repos);
    const message = "yo";
    const queryParams = req.params;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const repoId = queryParams.repoId;
      let deployments = await getDeployments(req,repoId);
      console.log(deployments)
      res.render("environments", { user: userData, message: message });
    } else {
      res.redirect("/environments");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
});

module.exports = router;
