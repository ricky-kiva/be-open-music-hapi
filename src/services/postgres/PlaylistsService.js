'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBPlaylistToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async add({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const q = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    };

    const result = await this._pool.query(q);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add playlist');
    }

    return result.rows[0].id;
  }

  async getAll(owner) {
    const q = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [owner]
    };

    const result = await this._pool.query(q);

    return result.rows
      .map(mapDBPlaylistToModel);
  }

  async getById(id) {
    const q = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    };

    const result = await this._pool.query(q);

    return result.rows
      .map(mapDBPlaylistToModel)[0];
  }

  async deleteById(id) {
    const q = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }
  }

  async verifyOwner(id, owner) {
    const q = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("You don't have the right to access this resource");
    }
  }
}

module.exports = PlaylistsService;
