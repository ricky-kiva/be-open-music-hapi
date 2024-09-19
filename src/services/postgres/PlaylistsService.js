'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

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
}

module.exports = PlaylistsService;
