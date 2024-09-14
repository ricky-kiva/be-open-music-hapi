'use strict';

const songPath = '/songs';

const routes = (h) => [
  {
    method: 'POST',
    path: songPath,
    handler: h.postSong
  }, {
    method: 'GET',
    path: songPath,
    handler: h.getSongs
  }, {
    method: 'GET',
    path: `${songPath}/{id}`,
    handler: h.getSongById
  }, {
    method: 'PUT',
    path: `${songPath}/{id}`,
    handler: h.putSongById
  }, {
    method: 'DELETE',
    path: `${songPath}/{id}`,
    handler: h.deleteSongById
  }
];

module.exports = routes;
