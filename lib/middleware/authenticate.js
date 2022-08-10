const jwt = require('jsonwebtoken');

//Checks the httponly session cookie for the current user, 
//verifies the jot token stored in cookie, and attaches to request

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];

    if (!cookie) throw new Error('You must be signed in to continue');

    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;

    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
