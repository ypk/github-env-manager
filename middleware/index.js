var getAccessToken = require("./github/getAccessToken");
var getUser = require("./github/getUser");
var { getRepositories, getRepositoriesWithDeployments } = require("./github/getRepositories");

module.exports = {
  getAccessToken,
  getUser,
  getRepositories,
  getRepositoriesWithDeployments
};
