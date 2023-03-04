const http = require('node:http');

exports.post = (req, res, url, token) => {
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
    path: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Authorization: `Bearer ${token}`,
    },
  };
  const request = http.request(options, (requestResponse) => {
    if (requestResponse.statusCode === 201) {
      console.log(`${req.body.email} registered in mail subscription`);
      res
        .status(200)
        .send({msg: `${req.body.email} registered in mail subscription`});
    }
    if (requestResponse.statusCode === 205) {
      console.log('User deleted');
      res.status(200).send({msg: 'User deleted'});
    }

    if (requestResponse.statusCode === 409) {
      console.log(`${req.body.email} already registered in mail subscription`);
      res.status(409).send({
        msg: `${req.body.email} already registered in mail subscription`,
      });
    }
    if (requestResponse.statusCode === 401) {
      console.log('Token expired');
      res.status(401).send({msg: 'Token expired'});
    }
    if (requestResponse.statusCode === 403) {
      console.log('No authorization header');
      res.status(403).send({msg: 'No authorization header'});
    }

    requestResponse.setEncoding('utf8');
  });
  request.on('error', (e) => {
    res.status(500).send({msg: 'Token expired'});
    console.error(`Cannot subscribe ${req.body.email} -> ${e} `);
  });
  request.write(body);

  request.end();
};

exports.get = (req, res, url, token) => {
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
    path: url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const request = http.get(
    `http://localhost:${process.env.SUBS_SERVER_PORT}${url}?email=${body.email}`,
    (response) => {
      response.on('end', (chunk) => {
        console.log('WORKS', chunk);
      });
    },
  );
  request.on('error', (e) => {
    res.status(500).send('Token expired');
    console.error(`Cannot subscribe ${req.body.email} -> ${e} `);
  });
  request.write(body);

  request.end();
};
