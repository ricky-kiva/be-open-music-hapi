'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  async add({ playlistId, songId }) {
    await this._songsService.getById(songId);

    const id = `pl-songs-${nanoid(16)}`;

    const q = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add song to playlist');
    }
  }
}

module.exports = PlaylistSongsService;
