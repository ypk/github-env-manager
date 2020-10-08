var fetch = require("node-fetch");

const getRepositories = async (auth_code) => {
  const api_uri = "https://api.github.com/user/repos";
  try {
    const request = await fetch(api_uri, {
      headers: {
        "Authorization": `Bearer ${auth_code}`,
        "Content-Type": "application/json"
      },
    });
    const data = await request.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getRepositoriesWithDeployments = (auth_code, repoList) => {
};


module.exports = {
  getRepositories,
  getRepositoriesWithDeployments
};
