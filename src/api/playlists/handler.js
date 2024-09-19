'use strict';

const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylist(req, h) {
    this._validator.validatePayload(req.payload);

    const { id: credentialId } = req.auth.credentials;
    const { name } = req.payload;

    const playlistId = await this._service.add({ name, owner: credentialId });

    const res = h.response({
      status: 'success',
      data: { playlistId }
    });

    res.code(201);

    return res;
  }

  async getPlaylists(req) {
    const { id: credentialId } = req.auth.credentials;

    const playlists = await this._service.getAll(credentialId);

    return {
      status: 'success',
      data: { playlists }
    };
  }

  async deletePlaylistById(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._service.verifyOwner(id, credentialId);
    await this._service.deleteById(id);

    return {
      status: 'success',
      message: 'Playlist successfully deleted'
    };
  }
}

module.exports = PlaylistsHandler;