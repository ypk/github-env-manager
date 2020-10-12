const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const { getDeployments, getDeploymentStatus } = require("../middleware");
const {
  timeAgo,
  humanReadable,
} = require("../helpers");

router.get("/", function (req, res, next) {
  if (req.session.user) {
    if (req.session.pat) {
      const userData = JSON.parse(req.session.user);
      const repoData = JSON.parse(req.session.repos);
      const message =
        req.session.message ||
        "We've found the following repositories associated with your account";
      res.render("environments", {
        user: userData,
        repos: repoData,
        message: message,
        pat: req.session.pat,
      });
    } else {
      res.redirect("/authorize");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
});

router.get("/:repoId", async function (req, res, next) {
  if (req.session.user) {
    const userData = JSON.parse(req.session.user);
    const queryParams = req.params;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const repoId = queryParams.repoId;
      let deployments = await getDeployments(req, repoId);
      if (deployments.length === 0) {
        req.session.message =
          "That repository does not contain any deployments";
        res.redirect("/environments");
      } else {
        let updatedDeploymentData = await Promise.all(
          deployments.map(async (deployment) => {
            let deploymentStatus = await getDeploymentStatus(
              req,
              deployment.statuses_url
            );
            const extractedStatus = deploymentStatus.map((status) => {
              const {
                urlencoded,
                id,
                node_id,
                state,
                description,
                environment,
                target_url,
                created_at,
                updated_at,
              } = status;
              return {
                urlencoded,
                id,
                node_id,
                state,
                description,
                environment,
                target_url,
                created_at,
                updated_at,
              };
            });
            deployment.status = extractedStatus;
            return deployment;
          })
        );
        let message = `displaying ${updatedDeploymentData.length} deployment(s)`;
        res.render("deployments", {
          user: userData,
          message: message,
          deployments: updatedDeploymentData,
          helpers: {
            timeAgo,
            humanReadable,
          }          
        });
      }
    } else {
      res.redirect("/environments");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
});



router.get("/:repoId/manage", async function (req, res, next) {
  res.send("You're in deployment manage page")
});

module.exports = router;
