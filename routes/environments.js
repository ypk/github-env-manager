const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const { getDeployments } = require("../middleware");
const { timeAgo, humanReadable } = require("../helpers");

const gateKeper = async (req, res, next) => {
  if (req.session.user) {
    if (req.session.pat) {
      next();
    } else {
      res.redirect("/authorize");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
}

router.get("/", gateKeper, async (req, res) => {
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
});

const viewParams = (userData, queryParams, message, deployments, req) => {
  return {
      user: userData,
      repoId: queryParams.repoId,
      deploymentId: queryParams.deploymentId,
      message: message,
      deployments: deployments,
      helpers: {
        timeAgo,
        humanReadable,
      },
      reqUrl: req.url
  }
};

const renderTemplate = async (res, req, messages, viewName ) => {
  const userData = JSON.parse(req.session.user);
  const queryParams = req.params;
  if (queryParams && Object.keys(queryParams).length > 0) {
    const repoId = queryParams.repoId;
    let deployments = await getDeployments(req, repoId);
    if (deployments.length === 0) {
      req.session.message = messages.notFoundMessage;
      req.session.updateMessage = true;
      res.redirect("/environments");
    } else {
      let message = messages.foundMessage;
      let viewProps = viewParams(userData, queryParams, message, deployments, req);
      res.render(viewName, viewProps);
    }
  } else {
    res.redirect("/environments");
  }
};

const getRepositoryNameById = async (req, repoId) => {
  const repoData = JSON.parse(req.session.repos);
  return await repoData.find(repo => repo.id == repoId).name;
};

router.get("/:repoId", gateKeper, async (req, res) => {
  const queryParams = req.params;
  const repoId = queryParams.repoId;
  const repoName = await getRepositoryNameById(req, repoId);
  const message = {
    "notFoundMessage": "That repository does not contain any deployments",
    "foundMessage": `displaying deployment(s) for \`${repoName}\` (${repoId})`
  };
  const viewName = "deployments";
  renderTemplate(res, req, message, viewName);
});

router.get("/:repoId/deployment/:deploymentId", gateKeper, async (req, res) => {
  const queryParams = req.params;
  const repoId = queryParams.repoId;
  const repoName = await getRepositoryNameById(req, repoId);
  const message = {
    "notFoundMessage": "That deployment does not contain any statuses",
    "foundMessage": `displaying status(es) for \`${repoName}\` (${repoId}) deployment #${queryParams.repoId}`
  };
  const viewName = "manage-deployments";
  renderTemplate(res, req, message, viewName);
});

router.get("/:repoId/deployment/:deploymentId/delete/:statusId", gateKeper, async (req, res) => {
  const queryParams = req.params;
  if (queryParams && Object.keys(queryParams).length > 0) {
  } else {
    res.redirect("/:repoId/deployment/:deploymentId");
  }
});

module.exports = router;