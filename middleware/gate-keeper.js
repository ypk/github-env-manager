const createError = require("http-errors");

const gateKeeper = async (req, res, next) => {
  if (req.session.user) {
    if (req.session.pat) {
      next();
    } else {
      res.redirect("/authorize");
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
};

module.exports = gateKeeper;