'use strict';

const authsPath = '/authentications';

const routes = (h) => [
  {
    method: 'POST',
    path: authsPath,
    handler: h.postAuth
  }, {
    method: 'PUT',
    path: authsPath,
    handler: h.putAuth
  }, {
    method: 'DELETE',
    path: authsPath,
    handler: h.deleteAuth
  }
];

module.exports = routes;
