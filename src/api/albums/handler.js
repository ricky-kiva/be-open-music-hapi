'use strict';

const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, storageService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbum(req, h) {
    this._validator.validatePayload(req.payload);

    const { name, year } = req.payload;

    const albumId = await this._albumsService.add({ name, year });

    const res = h.response({
      status: 'success',
      data: { albumId }
    });

    res.code(201);

    return res;
  }

  async getAlbumById(req, h) {
    const { id } = req.params;

    const album = await this._albumsService.getById(id);

    return h.response({
      status: 'success',
      data: { album }
    });
  }

  async putAlbumById(req) {
    this._validator.validatePayload(req.payload);

    const { id } = req.params;

    await this._albumsService.editById(id, req.payload);

    return {
      status: 'success',
      message: 'Album successfully updated'
    };
  }

  async deleteAlbumById(req) {
    const { id } = req.params;

    await this._albumsService.deleteById(id);

    return {
      status: 'success',
      message: 'Album successfully deleted'
    };
  }

  async postAlbumCover(req, h) {
    const { cover } = req.payload;

    this._validator.validateCoverHeaders(cover.hapi.headers);

    await this._storageService.writeFile(cover, cover.hapi);

    // TODO save to DB

    const res = h.response({
      status: 'success',
      message: 'Cover successfully uploaded'
    });

    res.code(201);

    return res;
  }
}

module.exports = AlbumsHandler;
