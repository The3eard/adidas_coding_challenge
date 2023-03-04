require('dotenv').config({path: __dirname + '/../.env'});

const events = require('events');
const http = require('node:http');

exports.create_user = (req, res) => {
  return (promise = new Promise((resolve, reject) => {
    const body = JSON.stringify({
      user: req.body.user,
      mail: req.body.mail,
    });
    const options = {
      hostname: 'localhost',
      port: process.env.DATABASE_PORT,
      path: '/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const request = http.request(options, (requestResponse) => {
      if (requestResponse.statusCode === 201) {
        console.log(`${req.body.mail} created`);
        resolve(req.body.mail);
      }
      requestResponse.setEncoding('utf8');
    });
    request.on('error', (e) => {
      console.error(`Cannot create user`);
    });
    request.write(body);

    request.end();
  }));
};

exports.userEvent = new events.EventEmitter();

exports.find_user = (mail) => {
  return (promise = new Promise((resolve, reject) => {
    http
      .get(`http://localhost:3000/users/?mail=${mail}`, (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
          this.userEvent.emit('response', data);
          res.statusCode;
          resolve(JSON.parse(data)[0]);
        });
        res.on('end', (data) => {});
      })
      .on('error', (e) => {
        this.userEvent.emit('response', {error: true});
        console.error(`Got error: ${e.message}`);
      });
  }));
};
