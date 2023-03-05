require('dotenv').config({path: __dirname + '/.env'});

const express = require('express');
const cors = require('cors');
const http = require('node:http');

const bodyParser = require('body-parser');
const app = express();
const port = process.env.PUBLIC_SERVER_PORT;
const service = require('./security/service');

let token;

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Subscription server is running on localhost:${port}...`);
  service.payloadEvent.on(
    'token',
    (payload) => (token = JSON.parse(payload).token),
  );
  service.authorization(
    process.env.USER_SERVICE_USER,
    process.env.USER_SERVICE_PASSWORD,
    process.env.SUBS_SERVICE_USER,
    process.env.SUBS_SERVER_PORT,
  );
});

app.post('/subscribe', (req, res) => {
  if (
    req.body.email != undefined &&
    req.body.dateOfBirth != undefined &&
    req.body.consent != undefined &&
    req.body.newsletterId != undefined &&
    req.body.consent
  ) {
    let body = {
      email: req.body.email,
      firstName: req.body.firstName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      consent: req.body.consent,
      newsletterId: req.body.newsletterId,
      id: req.body.id,
    };
    body = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: process.env.SUBS_SERVER_PORT,
      path: '/create_subscription',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        Authorization: `Bearer ${token}`,
      },
    };
    http
      .request(options, (response) => {
        let data = '';
        response.on('data', (d) => {
          data += d;
        });
        response.on('end', () => {
          res.send(JSON.parse(data));
        });
      })
      .on('error', console.error)
      .end(body);
  } else {
    res.status(206).send({
      msg: 'To subscribe you need email, date of birth, newsLetter id and accept the consent',
    });
  }
});

app.post('/unsubscribe', (req, res) => {
  if (req.body.email != undefined) {
    let body = {
      email: req.body.email,
      firstName: req.body.firstName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      consent: req.body.consent,
      newsletterId: req.body.newsletterId,
      id: req.body.id,
    };
    body = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: process.env.SUBS_SERVER_PORT,
      path: '/delete_subscription',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        Authorization: `Bearer ${token}`,
      },
    };
    http
      .request(options, (response) => {
        let data = '';
        response.on('data', (d) => {
          data += d;
        });
        response.on('end', () => {
          console.log('DELETE', data);
          res.send(data);
        });
      })
      .on('error', console.error)
      .end(body);
  } else {
    res.status(200).send({msg: 'Need ID to delete subscription'});
  }
});

app.get('/get_subscription', (req, res) => {
  email = req.query.email;
  if (email != undefined) {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: `/get_subscription?email=${email}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const request = http.get(options, (response) => {
      response.on('data', (chunk) => {
        const jsonString = Buffer.from(chunk).toString('utf8');
        const parsedData = JSON.parse(jsonString);
        res.send(parsedData);
      });
    });
    request.end();
  } else res.send({msg: 'Insert email to find subscription'});
});

app.get('/get_all_subscriptions', (req, res) => {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: `/get_all_subscriptions`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const request = http.get(options, (response) => {
    response.on('data', (chunk) => {
      const jsonString = Buffer.from(chunk).toString('utf8');
      const parsedData = JSON.parse(jsonString);
      res.send(parsedData);
    });
  });
  request.end();
});

app.get('/test', (req, res) => res.send(token));
