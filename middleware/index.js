var getAccessToken = require("./github/getAccessToken");
var getUser = require("./github/getUser");
var { getRepositories, getDeployments, getDeploymentStatus } = require("./github/getRepositories");

module.exports = {
  getAccessToken,
  getUser,
  getRepositories,
  getDeployments,
  getDeploymentStatus
};
