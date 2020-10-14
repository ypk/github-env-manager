const express = require("express");
const router = express.Router();
const { gateKeeper, getDeployments, deleteDeployment } = require("../middleware");
const { timeAgo, humanReadable } = require("../helpers");

router.get("/", gateKeeper, async (req, res) => {
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
  const params = {
    user: userData,
    message: message,
    helpers: {
      timeAgo,
      humanReadable,
    },
    reqUrl: req.url
  };
  if(queryParams) {
    Object.assign(params, queryParams);
  }
  if(deployments) {
    Object.assign(params, {
      deployments: deployments
    });
  }
  return params;
};

const renderTemplate = async (res, req, messages, viewName ) => {
  const userData = JSON.parse(req.session.user);
  const queryParams = req.params;
  if (queryParams && Object.keys(queryParams).length > 0) {
    const repoId = queryParams.repoId;
    let deployments = await getDeployments(req, repoId);
    if (deployments.length === 0) {
      req.session.message = messages.altNotification;
      req.session.updateMessage = true;
      res.redirect("/environments");
    } else {
      let message = req.session.updateMessage ? req.session.message : messages.notification;
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

router.get("/:repoId", gateKeeper, async (req, res) => {
  const queryParams = req.params;
  const repoId = queryParams.repoId;
  const repoName = await getRepositoryNameById(req, repoId);
  const message = {
    "altNotification": "That repository does not contain any deployments",
    "notification": `displaying deployment(s) for \`${repoName}\` (${repoId})`
  };
  const viewName = "deployments";
  renderTemplate(res, req, message, viewName);
});

router.get("/:repoId/deployment/:deploymentId", gateKeeper, async (req, res) => {
  const queryParams = req.params;
  const repoId = queryParams.repoId;
  const deploymentId = queryParams.deploymentId;
  const repoName = await getRepositoryNameById(req, repoId);
  const message = {
    "altNotification": "That deployment does not contain any statuses",
    "notification": `displaying status(es) for \`${repoName}\` (${repoId}) deployment #${deploymentId}`
  };
  const viewName = "manage-deployments";
  renderTemplate(res, req, message, viewName);
});

router.get("/:repoId/deployment/:deploymentId/delete", gateKeeper, async (req, res) => {
  const queryParams = req.params;
  if (queryParams && Object.keys(queryParams).length > 0) {
    const repoId = queryParams.repoId;
    const deploymentId = queryParams.deploymentId;
    const response = await deleteDeployment(req, repoId, deploymentId);
    if(response === 204) {
      req.session.message = "The deployment was deleted successfully!";
      req.session.updateMessage = true;
      res.redirect(`/environments/${repoId}`);
    }
  } else {
    res.redirect("/:repoId/deployment/:deploymentId");
  }
});

module.exports = router;