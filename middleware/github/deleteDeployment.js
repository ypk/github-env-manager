const fetch = require("node-fetch");

const setDeploymentStatusToInactive = async (pat, username, repoName, deploymentId) => {
  const api_uri = `https://api.github.com/repos/${username}/${repoName}/deployments/${deploymentId}/statuses`;
  try {
    const response = await fetch(api_uri, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.ant-man-preview+json",
        "Authorization": `token ${pat}`,
      },
      method: "POST",
      body: JSON.stringify({
        state: "inactive",
      }),
    });
    const data = await response.status;
    return data;
  } catch (e) {
    console.error(e);
  }
};

const deleteDeployment = async (req, repoId, deploymentId, statusId) => {
  const { pat, user, repos } = req.session;
  const userData = JSON.parse(user);
  const userName = userData.login;
  const repoList = JSON.parse(repos);
  const repoName = repoList.find((repo) => repo.id == repoId).name;
  const inactiveStatus = await setDeploymentStatusToInactive(pat, userName, repoName, deploymentId);
  const api_uri = `https://api.github.com/repos/${userName}/${repoName}/deployments/${deploymentId}`;
  try {
    if(inactiveStatus === 201) {
      const response = await fetch(api_uri, {
        headers: {
          Authorization: `token ${pat}`,
        },
        method: "DELETE"
      });
      const data = await response.status;
      return data;
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = deleteDeployment;