'use strict';

const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbum(req, h) {
    this._validator.validatePayload(req.payload);

    const { name, year } = req.payload;

    const albumId = await this._service.add({ name, year });

    const res = h.response({
      status: 'success',
      data: { albumId }
    });

    res.code(201);

    return res;
  }

  async getAlbumById(req, h) {
    const { id } = req.params;

    const album = await this._service.getById(id);

    return h.response({
      status: 'success',
      data: { album }
    });
  }

  async putAlbumById(req) {
    this._validator.validatePayload(req.payload);

    const { id } = req.params;

    await this._service.editById(id, req.payload);

    return {
      status: 'success',
      message: 'Album successfully updated'
    };
  }

  async deleteAlbumById(req) {
    const { id } = req.params;

    await this._service.deleteById(id);

    return {
      status: 'success',
      message: 'Album successfully deleted'
    };
  }
}

module.exports = AlbumsHandler;
