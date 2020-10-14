const createError = require("http-errors");

const authorizer = async (req, res, next) => {
  if (req.session.user) {
    if (req.session.pat) {
      res.redirect("/environments");
    } else {
        next();
    }
  } else {
    return next(createError(401, "Unauthorized Access"));
  }
};

module.exports = authorizer;
