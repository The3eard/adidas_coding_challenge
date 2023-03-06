## Create and launch email service docker container

### Paste in terminal:

`docker build . -t email-micro; docker run --network="host" -p 3003:3003 -d email-micro;`

### INFO

This docker container run on 3003 port.

You can access directly to the image in docker hub:
https://hub.docker.com/repository/docker/adolfofuentes/email-micro/general
