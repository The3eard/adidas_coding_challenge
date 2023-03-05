const events = require('events');
const http = require('node:http');

const token = require('./token');

exports.payloadEvent = new events.EventEmitter();

exports.authentication = (req, res) => {
  return res.status(200).send({token: token.create(req)});
};

exports.authorization = (username, pass, service, port) => {
  const postData = JSON.stringify({
    username: username,
    password: pass,
  });
  const options = {
    hostname: 'localhost',
    port: port,
    path: '/auth',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };
  const req = http.request(options, (res) => {
    if (res.statusCode === 200)
      console.log(`${username} auth in ${service} -> OK`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      this.payloadEvent.emit('token', chunk);
    });
  });
  req.on('error', (e) => {
    console.error(
      `Cannot auth ${username} in ${service}: ${e.message} - Retry...`,
    );
    retry = setInterval(() => {
      clearInterval(retry);
      this.authorization(username, pass, service, port);
    }, 3000);
  });
  req.write(postData);
  req.end();
};
