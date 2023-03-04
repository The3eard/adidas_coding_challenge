require('dotenv').config({path: __dirname + '/../.env'});

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();
const port = process.env.SUBS_SERVER_PORT;
const middleware = require('../security/middleware');
const service = require('../security/service');

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Subscription server is running on localhost:${port}...`);
});

app.post('/auth', service.authentication);

app.post('/create_subscription', middleware.isAuthenticated, (req, res) => {
  res.send();
});
