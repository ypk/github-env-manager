var fetch = require("node-fetch");

const getUser = async (auth_code) => {
  const api_uri = "https://api.github.com/user";
  try {
    const request = await fetch(api_uri, {
      headers: {
        "Authorization": `Bearer ${auth_code}`,
        "Content-Type": "application/json"
      },
    });
    const data = await request.text();
    return data;
  } catch (e) {
    console.error(e);
  }
};

module.exports = getUser;
