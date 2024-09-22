'use strict';

const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBAlbumToModel } = require('../../utils/index');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async add({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const q = {
      text: 'INSERT INTO albums (id, name, year) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year]
    };

    const result = await this._pool.query(q);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album');
    }

    return result.rows[0].id;
  }

  async getById(id) {
    const q1 = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    };

    const resultAlbum = await this._pool.query(q1);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album not found');
    }

    const mappedAlbum = resultAlbum.rows
      .map(mapDBAlbumToModel);

    const q2 = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id]
    };

    const resultSongs = await this._pool.query(q2);

    const album = {
      ...mappedAlbum[0],
      songs: resultSongs.rows
    };

    return album;
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

  async addCover(id, filename) {
    const q = {
      text: 'UPDATE albums SET cover = $2 WHERE id = $1 RETURNING id',
      values: [id, filename]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }
  }
}

module.exports = AlbumsService;
