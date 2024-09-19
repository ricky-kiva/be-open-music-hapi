'use strict';

const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService;
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
}

module.exports = PlaylistsHandler;
