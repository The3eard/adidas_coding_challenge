require('dotenv').config({path: __dirname + '/.env'});

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();
const port = process.env.SUBS_SERVER_PORT;
const middleware = require('./security/middleware');
const service = require('./security/service');
const users = require('./crud');

app.use(cors());
app.use(bodyParser.json());

let token;
app.listen(port, () => {
  console.log(`Subscription server is running on localhost:${port}...`);
  service.payloadEvent.on(
    'token',
    (payload) => (token = JSON.parse(payload).token),
  );
  service.authorization(
    process.env.SUBS_SERVICE_USER,
    process.env.SUBS_SERVICE_PASSWORD,
    process.env.EMAIL_SERVICE_USER,
    process.env.EMAIL_SERVER_PORT,
  );
});

app.post('/auth', service.authentication);

app.post(
  '/create_subscription',
  middleware.isAuthenticated,
  async (req, res) => {
    let user;
    let newUser;
    await users.find_user(req.body.email).then((data) => (user = data));
    if (user == null) {
      await users.create_user(req, res, token).then((data) => (newUser = data));
      res.status(201).send(newUser);
    } else res.status(409).send({msg: `User ${user.email} already exists`});
  },
);

app.post(
  '/delete_subscription',
  middleware.isAuthenticated,
  async (req, res) => {
    let user;
    await users.find_user(req.body.email).then((data) => (user = data));
    if (user != null) {
      let msg;
      await users
        .delete_user(req, res, user, token)
        .then((data) => (msg = data));
      res.send(msg);
    } else res.status(409).send({msg: `User doesn't exists`});
  },
);

app.get('/get_subscription', middleware.isAuthenticated, async (req, res) => {
  email = req.query.email;
  let user;
  await users.find_user(email).then((data) => (user = data));
  if (user != null) {
    res.status(200).send(user);
  } else res.status(409).send({msg: `User not found`});
});

app.get(
  '/get_all_subscriptions',
  middleware.isAuthenticated,
  async (req, res) => {
    let subs;
    await users.find_all().then((data) => (subs = data));
    if (subs != null) {
      res.status(200).send(subs);
    } else res.status(409).send({msg: `There are no subscriptions`});
  },
);
