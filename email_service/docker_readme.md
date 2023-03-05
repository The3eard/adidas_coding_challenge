## Create and launch email service docker container

### Paste in terminal:

`docker build . -t adidas/email-micro; docker run --network="host" -p 3003:3003 -d adidas/email-micro;`

### INFO

This docker container run on 3003 port.
