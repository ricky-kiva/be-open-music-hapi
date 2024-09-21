'use strict';

const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylist(req, h) {
    this._validator.validatePayload(req.payload);

    const { id: credentialId } = req.auth.credentials;
    const { name } = req.payload;

    const playlistId = await this._playlistsService.add({ name, owner: credentialId });

    const res = h.response({
      status: 'success',
      data: { playlistId }
    });

    res.code(201);

    return res;
  }

  async getPlaylists(req) {
    const { id: credentialId } = req.auth.credentials;

    const playlists = await this._playlistsService.getAll(credentialId);

    return {
      status: 'success',
      data: { playlists }
    };
  }

  async deletePlaylistById(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyOwner(id, credentialId);
    await this._playlistsService.deleteById(id);

    return {
      status: 'success',
      message: 'Playlist successfully deleted'
    };
  }

  async getPlaylistById(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyOwner(playlistId, credentialId);

    const playlist = await this._playlistsService.getById(playlistId);
    const songs = await this._playlistSongsService.getAll(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs
        }
      }
    };
  }

  async postPlaylistSongBySongId(req, h) {
    this._validator.validatePostSongPayload(req.payload);

    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyOwner(playlistId, credentialId);

    const { songId } = req.payload;

    await this._playlistSongsService.add({ playlistId, songId });

    const res = h.response({
      status: 'success',
      message: 'Song successfully added to playlist'
    });

    res.code(201);

    return res;
  }

  async deletePlaylistSongBySongId(req) {
    this._validator.validateDeleteSongPayload(req.payload);

    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyOwner(playlistId, credentialId);

    const { songId } = req.payload;

    await this._playlistSongsService.delete({ playlistId, songId });

    return {
      status: 'success',
      message: 'Song successfully deleted from playlist'
    };
  }
}

module.exports = PlaylistsHandler;
