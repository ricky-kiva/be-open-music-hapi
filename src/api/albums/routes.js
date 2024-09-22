'use strict';

const path = require('path');

const albumPath = '/albums';

const routes = (h) => [
  {
    method: 'POST',
    path: albumPath,
    handler: h.postAlbum
  }, {
    method: 'GET',
    path: `${albumPath}/{id}`,
    handler: h.getAlbumById
  }, {
    method: 'PUT',
    path: `${albumPath}/{id}`,
    handler: h.putAlbumById
  }, {
    method: 'DELETE',
    path: `${albumPath}/{id}`,
    handler: h.deleteAlbumById
  }, {
    method: 'POST',
    path: `${albumPath}/{id}/covers`,
    handler: h.postAlbumCover,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000
      }
    }
  }, {
    method: 'GET',
    path: `${albumPath}/covers/{param*}`,
    handler: {
      directory: {
        path: path.resolve(__dirname, 'files', 'covers')
      }
    }
  }
];

module.exports = routes;
