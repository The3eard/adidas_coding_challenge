## Create and launch public service docker container

### Paste in terminal:

`docker build . -t adidas/public-micro; docker run --network="host" -p 3001:3001 -d adidas/public-micro;`

### INFO

This docker container run on 3001 port.
