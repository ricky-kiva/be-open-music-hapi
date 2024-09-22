'use strict';

const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylist(req, h) {
    this._validator.validatePayloadPlaylist(req.payload);

    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyOwner(playlistId, credentialId);

    const { targetEmail } = req.payload;

    const message = { playlistId, targetEmail };

    const queue = 'export:playlist';

    await this._producerService.sendMessage(
      queue,
      JSON.stringify(message)
    );

    const res = h.response({
      status: 'success',
      message: 'Your request is being processed'
    });

    res.code(201);

    return res;
  }
}

module.exports = ExportsHandler;
