const jwt = require('jsonwebtoken');

module.exports = {
  authMiddleware: (req, res, next) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {

      req.isAuth = false;
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === '') {

      req.isAuth = false;
      return next();
    }

    let decodedToken = null;

    try {

      decodedToken = jwt.verify(token, 'secretkey');
    }
    catch (err) {

      req.isAuth = false;
      return next();
    }

    req.isAuth = true;
    req.user = decodedToken;

    next();
  }
};