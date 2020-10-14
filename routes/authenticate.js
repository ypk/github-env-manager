const express = require("express");
const { getAccessToken, getUser, getRepositories } = require("../middleware");
require("dotenv").config();
const router = express.Router();

const github_client_id = process.env.GITHUB_CLIENT_ID;
const github_client_secret = process.env.GITHUB_CLIENT_SECRET;

router.get("/", function (req, res, next) {
  const oauth_uri = `https://github.com/login/oauth/authorize?client_id=${github_client_id}`;
  res.redirect(oauth_uri);
});

router.get("/callback", async function (req, res, next) {
  const code = req.query.code;
  const token = await getAccessToken(
    github_client_id,
    github_client_secret,
    code
  );
  const repos = await getRepositories(token);
  req.session.token = token;
  req.app.locals.token = token;
  const user = await getUser(token);
  if (user) {
    const parsedUser = JSON.parse(user);
    const userObj = {
      id: parsedUser.id,
      name: parsedUser.name,
      login: parsedUser.login,
      avatar: parsedUser.avatar_url,
      profile: parsedUser.html_url,
    };
    req.session.user = JSON.stringify(userObj);
    req.app.locals.user = userObj;
    if (repos) {
      req.session.repos = JSON.stringify(repos);
      req.app.locals.user = JSON.stringify(repos);
    }
    res.redirect("/");
  } else {
    const errorMessage = "Error trying to fetch user details";
    console.error(errorMessage);
    res.send(errorMessage);
  }
});

router.get("/logout", async function (req, res, next) {
  res.app.locals.token = null;
  res.app.locals.user = null;
  req.session = null;
  res.redirect("/");
});

module.exports = router;
