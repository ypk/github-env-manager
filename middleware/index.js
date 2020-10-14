var getAccessToken = require("./github/getAccessToken");
var getUser = require("./github/getUser");
var { getRepositories, getDeployments, getDeploymentStatus } = require("./github/getRepositories");
var deleteDeployment = require("./github/deleteDeployment");

module.exports = {
  getAccessToken,
  getUser,
  getRepositories,
  getDeployments,
  getDeploymentStatus,
  deleteDeployment
};
