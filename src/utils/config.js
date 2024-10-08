'use strict';

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  jwt: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
    tokenAge: process.env.ACCESS_TOKEN_AGE
  },
  rabbitMQ: {
    server: process.env.RABBITMQ_SERVER
  },
  redis: {
    server: process.env.REDIS_SERVER
  }
};

module.exports = config;
