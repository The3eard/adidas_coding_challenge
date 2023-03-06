## Create and launch subscription service docker container

### Paste in terminal:

`docker build . -t subs-micro; docker run --network="host" -p 3002:3002 -p 3000:3000 -d subs-micro;`

### INFO

This docker container run on 3002 port.

This docker container run on 3003 port.
You can access directly to the image in docker hub:
https://hub.docker.com/repository/docker/adolfofuentes/subs-micro/general
