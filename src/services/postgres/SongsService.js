'use strict';

const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBSongToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async add({
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null
  }) {
    const id = nanoid(16);

    const q = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId]
    };

    const result = await this._pool.query(q);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add song');
    }

    return result.rows[0].id;
  }

  async getAll() {
    const result = await this._pool
      .query('SELECT * FROM songs');

    return result.rows
      .map(mapDBSongToModel);
  }

  async getById(id) {
    const q = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }

    return result.rows
      .map(mapDBSongToModel)[0];
  }

  async editById(
    id,
    {
      title,
      year,
      genre,
      performer,
      duration,
      albumId
    }
  ) {
    const q = {
      text: `
        UPDATE songs SET 
        title = $2, year = $3, genre = $4, performer = $5, duration = $6, album_id = $7 
        WHERE id = $1 RETURNING id
      `,
      values: [id, title, year, genre, performer, duration, albumId]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }

  async deleteById(id) {
    const q = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }
}

module.exports = SongsService;
