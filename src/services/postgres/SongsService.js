'use strict';

const { nanoid } = require('nanoid');
const { Pool } = require('pg');
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
    const id = `song-${nanoid(16)}`;

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

  async getAll(title, performer) {
    let text = 'SELECT id, title, performer FROM songs';
    const values = [];

    if (title || performer) {
      text += ' WHERE';

      if (title) {
        text += ` title ILIKE $${values.length + 1}`;
        values.push(`%${title}%`);
      }

      if (performer) {
        if (title) text += ' AND';

        text += ` performer ILIKE $${values.length + 1}`;
        values.push(`%${performer}%`);
      }
    }

    const q = { text, values };

    const result = await this._pool.query(q);

    return result.rows;
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

    return result.rows[0];
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
        title = $2, year = $3, genre = $4, performer = $5, duration = $6, "albumId" = $7 
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
