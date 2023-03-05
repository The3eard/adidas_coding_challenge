require('dotenv').config({path: __dirname + '/.env'});

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();
const port = process.env.EMAIL_SERVER_PORT;
const middleware = require('./security/middleware');
const service = require('./security/service');
const email = require('./email');

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Email server is running on localhost:${port}...`);
});

app.post('/auth', service.authentication);

app.post('/send_mail', middleware.isAuthenticated, (req, res) => {
  email.send(req.body);
  res.send({msg: 'OK'});
});
