const JWT = require("jsonwebtoken")
const currentUser = (req, res, next) => {
 
  if (!req.session.jwt) {
    return res.status(401).send("Token is required")
  }

  try {
    const payload = JWT.verify(
      req.session.jwt,
      process.env.key
    )
    req.currentUser = payload;
  } catch (err) {}

  next();
};

module.exports = {currentUser}