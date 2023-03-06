require('dotenv').config({path: __dirname + '/.env'});

const events = require('events');
const {response} = require('express');
const http = require('node:http');

exports.userEvent = new events.EventEmitter();

exports.create_user = (req, res, token) => {
  return (promise = new Promise((resolve, reject) => {
    const body = JSON.stringify({
      email: req.body.email,
      firstName: req.body.firstName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      consent: req.body.consent,
      newsletterId: req.body.newsletterId,
      subscribe: true,
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

    http
      .request(options, (res) => {
        if (response.statusCode == 200) sendMail(body, token);
        let data = '';
        res.on('data', (d) => {
          data += d;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', console.error)
      .end(body);
  }));
};

exports.find_user = (mail) => {
  return (promise = new Promise((resolve, reject) => {
    http
      .get(`http://localhost:3000/users/?email=${mail}`, (res) => {
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

exports.delete_user = (req, res, user, token) => {
  return (promise = new Promise((resolve, reject) => {
    const body = JSON.stringify({
      email: user.email,
      firstName: user.email,
      gender: user.email,
      dateOfBirth: user.email,
      consent: user.consent,
      newsletterId: user.newsletterId,
      id: user.id,
      subscribe: false,
    });

    const options = {
      hostname: 'localhost',
      port: process.env.DATABASE_PORT,
      path: `/users/${user.id}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    http
      .request(options, (res) => {
        if (response.statusCode == 200) sendMail(body, token);
        res.on('data', () => {});
        res.on('end', () => {
          resolve(`User ${req.body.email} deleted`);
        });
      })
      .on('error', console.error)
      .end(body);
  }));
};

exports.find_all = () => {
  return (promise = new Promise((resolve, reject) => {
    http
      .get(`http://localhost:3000/users`, (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
          this.userEvent.emit('response', data);
          res.statusCode;
          resolve(JSON.parse(data));
        });
        res.on('end', (data) => {});
      })
      .on('error', (e) => {
        this.userEvent.emit('response', {error: true});
        console.error(`Got error: ${e.message}`);
      });
  }));
};

sendMail = (body, token) => {
  const options = {
    hostname: 'localhost',
    port: process.env.EMAIL_SERVER_PORT,
    path: '/send_mail',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Authorization: `Bearer ${token}`,
    },
  };

  http
    .request(options, (res) => {
      res.on('data', (d) => {});
      res.on('end', () => {
        console.log('Sending email');
      });
    })
    .on('error', console.error)
    .end(body);
};
