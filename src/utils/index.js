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

const mapOwnerIdToUsername = ({ ownerId, username }) => {
  return (o) => ({
    ...o,
    owner: o.owner === ownerId
      ? username
      : o.owner
  });
};

module.exports = {
  mapDBSongToModel,
  mapDBPlaylistToModel,
  mapOwnerIdToUsername
};
