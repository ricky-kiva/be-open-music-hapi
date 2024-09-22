'use strict';

const config = require('./config');

const getAlbumCover = (cover) => {
  return `http://${config.app.host}:${config.app.port}/albums/covers/${cover}`;
};

module.exports = { getAlbumCover };
