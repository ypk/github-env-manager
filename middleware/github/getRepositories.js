const fetch = require("node-fetch");

const getRepositories = async (auth_code) => {
  const api_uri = "https://api.github.com/user/repos";
  try {
    const request = await fetch(api_uri, {
      headers: {
        Authorization: `Bearer ${auth_code}`,
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getDeploymentStatus = async (req, api_uri) => {
  const { pat } = req.session;
  try {
    const request = await fetch(api_uri, {
      headers: {
        "Authorization": `token ${pat}`
      }
    });
    const data = await request.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};


const getDeployments = async (req, repoId) => {
  const { pat, user, repos } = req.session;
  const userData = JSON.parse(user);
  const repoList = JSON.parse(repos);
  const repoName = repoList.find((repo) => repo.id == repoId).name;
  const api_uri = `https://api.github.com/repos/${userData.login}/${repoName}/deployments`;
  try {
    const request = await fetch(api_uri, {
      headers: {
        "Authorization": `Bearer ${pat}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    
    let deploymentData = await Promise.all(
      data.map(async (deployment) => {
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
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  getRepositories,
  getDeployments,
  getDeploymentStatus
};
