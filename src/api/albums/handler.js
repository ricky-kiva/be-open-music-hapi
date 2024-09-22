'use strict';

const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, storageService, albumLikesService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._albumLikesService = albumLikesService;
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

    const _album = await this._albumsService.getById(id);
    const songs = await this._albumsService.getSongs(id);

    const album = { ..._album, songs };

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

    const { id } = req.params;

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    await this._albumsService.addCover(id, filename);

    const res = h.response({
      status: 'success',
      message: 'Cover successfully uploaded'
    });

    res.code(201);

    return res;
  }

  async postLike(req, h) {
    const { id: albumId } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._albumsService.getById(albumId);
    await this._albumLikesService.like(userId, albumId);

    const res = h.response({
      status: 'success',
      message: 'Album successfully liked'
    });

    res.code(201);

    return res;
  }

  async deleteLike(req) {
    const { id: albumId } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._albumsService.getById(albumId);
    await this._albumLikesService.dislike(userId, albumId);

    return {
      status: 'success',
      message: 'Album successfully disliked'
    };
  }

  async getLikes(req) {
    const { id } = req.params;

    const likes = await this._albumLikesService.countLikes(id);

    return {
      status: 'success',
      data: { likes }
    };
  }
}

module.exports = AlbumsHandler;
