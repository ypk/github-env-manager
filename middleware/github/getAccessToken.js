var fetch = require("node-fetch");

const getAccessToken = async (client_id, client_secret, code) => {
  const oauth_uri = "https://github.com/login/oauth/access_token";
  try {
    const response = await fetch(oauth_uri, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });
    const data = await response.text();
    const params = new URLSearchParams(data);
    return await params.get("access_token");
  } catch (e) {
    console.error(e);
  }
};

module.exports = getAccessToken;
