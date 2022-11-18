const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let decode = jwt.verify(req.headers.authorization, process.env.SECRET);
      if (decode) {
        next();
      }
    }
  } catch (err) {
    res.status(500).json({
      message: `something went wrong; ${err} Try to logout and login after a minute`,
    });
  }
};

module.exports = authenticate;
