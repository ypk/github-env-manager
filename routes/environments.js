const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const { getDeployments, getDeploymentStatus } = require("../middleware");
const { timeAgo, humanReadable } = require("../helpers");

router.get("/", function (req, res, next) {
  if (req.session.user) {
    if (req.session.pat) {
      if(req.session.updateMessage) {
        req.session.updateMessage = false;
      } else {
        req.session.message = "We've found the following repositories associated with your account";
      }
      const userData = JSON.parse(req.session.user);
      const repoData = JSON.parse(req.session.repos);
      const message = req.session.message;
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

async function getDeploymentData (req, deployments) {
  let deploymentData = await Promise.all(
    deployments.map(async (deployment) => {
      let deploymentStatus = await getDeploymentStatus(
        req,
        deployment.statuses_url
      );
      const extractedStatus = deploymentStatus.map((status) => {
        const {
          id,
          state,
          description,
          environment,
          url,
          target_url,
          created_at,
          updated_at,
        } = status;
        return {
          id,
          state,
          description,
          environment,
          url,
          target_url,
          created_at,
          updated_at,
        };
      });
      deployment.status = extractedStatus;
      return deployment;
    })
  );
  return deploymentData;
};

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
        req.session.updateMessage = true;
        res.redirect("/environments");
      } else {
        let updatedDeploymentData = await getDeploymentData(req, deployments);
        let message = `displaying ${updatedDeploymentData.length} deployment(s)`;
        res.render("deployments", {
          user: userData,
          repoId: queryParams.repoId,
          message: message,
          deployments: updatedDeploymentData,
          helpers: {
            timeAgo,
            humanReadable,
          },
        });
      }
    } else {
      res.redirect("/environments");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
});


router.get("/:repoId/deployment/:deploymentId", async function (req, res, next) {
  if (req.session.user) {
    const userData = JSON.parse(req.session.user);
    const queryParams = req.params;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const repoId = queryParams.repoId;
      let deployments = await getDeployments(req, repoId);
      if (deployments.length === 0) {
        req.session.message =
          "That deployment does not contain any statuses";
        req.session.updateMessage = true;
        res.redirect("/environments");
      } else {
        let updatedDeploymentData = await getDeploymentData(req, deployments);
        let message = `displaying deployment status(es) for ${queryParams.repoId}`;
        res.render("manage-deployments", {
          user: userData,
          repoId: queryParams.repoId,
          deploymentId: queryParams.deploymentId,
          message: message,
          deployments: updatedDeploymentData,
          helpers: {
            timeAgo,
            humanReadable,
          },
        });
      }
    } else {
      res.redirect("/environments");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
});

module.exports = router;
