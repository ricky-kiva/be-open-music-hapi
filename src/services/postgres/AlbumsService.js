'use strict';

const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async add({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const q = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year]
    };

    const result = await this._pool.query(q);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album');
    }

    return result.rows[0].id;
  }

  async getById(id) {
    const q = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    return result.rows;
  }

  async editById(id, { name, year }) {
    const q = {
      text: 'UPDATE albums SET name = $2, year = $3 WHERE id = $1 RETURNING id',
      values: [id, name, year]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }
  }

  async deleteById(id) {
    const q = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }
  }
}

module.exports = AlbumsService;
