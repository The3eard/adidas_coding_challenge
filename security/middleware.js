require('dotenv').config({path: __dirname + '/../.env'});

const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.isAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({message: 'No authorization header'});
  }
  const auth = jwt.decode(
    req.headers.authorization.split(' ')[1],
    process.env.SECRET,
  );
  if (auth.exp <= moment().unix()) {
    return res.status(401).send({message: 'Token expired'});
  }
  req.user = auth.sub;
  next();
};
