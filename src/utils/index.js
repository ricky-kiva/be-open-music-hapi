/* eslint-disable camelcase */

'use strict';

const mapDBSongToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id
});

module.exports = mapDBSongToModel;
