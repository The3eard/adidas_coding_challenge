const http = require('node:http');

exports.post = (req, res, token) => {
  const body = JSON.stringify({
    user: req.body.user,
    mail: req.body.mail,
  });
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
  const request = http.request(options, (requestResponse) => {
    if (requestResponse.statusCode === 200) {
      console.log(`${req.body.user} registered in mail subscription`);
      res.status(200).send(`${req.body.user} registered in mail subscription`);
    }
    if (requestResponse.statusCode === 409) {
      console.log(`${req.body.user} already registered in mail subscription`);
      res.status(409).send(`${req.body.user} registered in mail subscription`);
    }
    if (requestResponse.statusCode === 401) {
      console.log('Token expired');
      res.status(401).send('Token expired');
    }
    if (requestResponse.statusCode === 403) {
      console.log('No authorization header');
      res.status(403).send('No authorization header');
    }
    requestResponse.setEncoding('utf8');
  });
  request.on('error', (e) => {
    res.status(500).send('Token expired');
    console.error(`Cannot subscribe ${req.body.user} -> ${e} `);
  });
  request.write(body);

  request.end();
};
