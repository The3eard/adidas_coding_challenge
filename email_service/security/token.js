require('dotenv').config({path: __dirname + '/../.env'});

const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.create = (req) => {
  const {username, password} = req.body;
  if (
    (username === process.env.USER_SERVICE_USER &&
      password === process.env.USER_SERVICE_PASSWORD) ||
    (username === process.env.SUBS_SERVICE_USER &&
      password === process.env.SUBS_SERVICE_PASSWORD)
  ) {
    const payload = {
      sub: username,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix(),
    };
    return jwt.sign(payload, process.env.SECRET);
  }
};
