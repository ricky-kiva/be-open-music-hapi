'use strict';

const AuthsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'auths',
  version: '1.0.0',
  register: async (server, {
    authsService,
    usersService,
    tokenManager,
    validator
  }) => {
    const authsHandler = new AuthsHandler(
      authsService,
      usersService,
      tokenManager,
      validator
    );

    server.route(routes(authsHandler));
  }
};
