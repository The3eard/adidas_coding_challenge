require('dotenv').config({path: __dirname + '/../.env'});

const express = require('express');
const cors = require('cors');

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

app.post('/subscribe', (req, res) => http.post(req, res, token));

app.get('/test', (req, res) => res.send(token));
