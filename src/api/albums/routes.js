'use strict';

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
  }
];

module.exports = routes;
