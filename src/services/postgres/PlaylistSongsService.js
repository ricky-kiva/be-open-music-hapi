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

  async getAll(playlistId) {
    const q = {
      text: `
        SELECT songs.id, songs.title, songs.performer FROM songs
        INNER JOIN playlist_songs ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId]
    };

    const result = await this._pool.query(q);

    return result.rows;
  }

  async delete({ playlistId, songId }) {
    await this._songsService.getById(songId);

    const q = {
      text: `
        DELETE FROM playlist_songs
        WHERE playlist_id = $1 AND song_id = $2
        RETURNING id
      `,
      values: [playlistId, songId]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete song from playlist');
    }
  }
}

module.exports = PlaylistSongsService;
