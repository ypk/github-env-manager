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

const getDeployments = async (req, repoId) => {
  const { token, user, repos } = req.session;
  const userData = JSON.parse(user);
  const repoList = JSON.parse(repos);
  const repoName = repoList.find((repo) => repo.id == repoId).name;
  const api_uri = `https://api.github.com/repos/${userData.login}/${repoName}/deployments`;
  try {
    const request = await fetch(api_uri, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();

console.log(data)
    return data;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  getRepositories,
  getDeployments,
};
