'use strict';

const path = require('path');

const albumsPath = '/albums';

const routes = (h) => [
  {
    method: 'POST',
    path: albumsPath,
    handler: h.postAlbum
  }, {
    method: 'GET',
    path: `${albumsPath}/{id}`,
    handler: h.getAlbumById
  }, {
    method: 'PUT',
    path: `${albumsPath}/{id}`,
    handler: h.putAlbumById
  }, {
    method: 'DELETE',
    path: `${albumsPath}/{id}`,
    handler: h.deleteAlbumById
  }, {
    method: 'POST',
    path: `${albumsPath}/{id}/covers`,
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
    path: `${albumsPath}/covers/{param*}`,
    handler: {
      directory: {
        path: path.resolve(__dirname, 'files', 'covers')
      }
    }
  }, {
    method: 'POST',
    path: `${albumsPath}/{id}/likes`,
    handler: h.postLike,
    options: { auth: 'open_music_jwt' }
  }, {
    method: 'DELETE',
    path: `${albumsPath}/{id}/likes`,
    handler: h.deleteLike,
    options: { auth: 'open_music_jwt' }
  }, {
    method: 'GET',
    path: `${albumsPath}/{id}/likes`,
    handler: h.getLikes
  }
];

module.exports = routes;
