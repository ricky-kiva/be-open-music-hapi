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

const mapDBPlaylistToModel = ({ id, name, owner }) => ({
  id,
  name,
  username: owner
});

module.exports = {
  mapDBSongToModel,
  mapDBPlaylistToModel
};
