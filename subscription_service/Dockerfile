FROM node:18

WORKDIR /usr/src/app

RUN apt-get install -y git

RUN git clone https://github.com/The3eard/adidas_coding_challenge.git

WORKDIR /usr/src/app/adidas_coding_challenge/subscription_service

RUN npm install

EXPOSE 3002

CMD [ "npm", "start" ]