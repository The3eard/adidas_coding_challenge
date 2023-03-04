require('dotenv').config({path: __dirname + '/../.env'});

const express = require('express');
const cors = require('cors');
const apphttp = require('node:http');

const bodyParser = require('body-parser');
const app = express();
const port = process.env.PUBLIC_SERVER_PORT;
const service = require('../security/service');
const http = require('./http');

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
    http.post(req, res, '/create_subscription', token);
  } else {
    res.status(206).send({
      msg: 'To subscribe you need email, date of birth, newsLetter id and accept the consent',
    });
  }
});

app.post('/unsubscribe', (req, res) => {
  if (req.body.email != undefined) {
    http.post(req, res, '/delete_subscription', token);
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
    const request = apphttp.get(options, (response) => {
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
  const request = apphttp.get(options, (response) => {
    response.on('data', (chunk) => {
      const jsonString = Buffer.from(chunk).toString('utf8');
      const parsedData = JSON.parse(jsonString);
      res.send(parsedData);
    });
  });
  request.end();
});

app.get('/test', (req, res) => res.send(token));
