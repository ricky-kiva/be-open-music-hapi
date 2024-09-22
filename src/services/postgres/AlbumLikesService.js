'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');

class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async like(userId, albumId) {
    await this.checkLike(userId, albumId);

    const id = `album-like-${nanoid(16)}`;

    const q = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Failed to like');
    }
  }

  async dislike(userId, albumId) {
    const q = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    };

    await this._pool.query(q);
  }

  async countLikes(albumId) {
    const q = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [albumId]
    };

    const result = await this._pool.query(q);

    return parseInt(result.rows[0].count, 10);
  }

  async checkLike(userId, albumId) {
    const q = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    };

    const result = await this._pool.query(q);

    if (result.rows.length > 0) {
      throw new ClientError('You already liked this album');
    }
  }
}

module.exports = AlbumLikesService;
