'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async dislike(userId, albumId) {
    const q = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    };

    await this._pool.query(q);
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async countLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      const intResult = parseInt(result, 10);

      return {
        fromCache: true,
        likes: intResult
      };
    } catch (e) {
      const q = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      };

      const result = await this._pool.query(q);
      const intResult = parseInt(result.rows[0].count, 10);

      await this._cacheService.set(
        `album-likes:${albumId}`,
        intResult,
        1800
      );

      return {
        fromCache: false,
        likes: intResult
      };
    }
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
