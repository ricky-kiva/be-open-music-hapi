'use strict';

const usersPath = '/users';

const routes = (h) => [
  {
    method: 'POST',
    path: usersPath,
    handler: h.postUser
  }
];

module.exports = routes;
