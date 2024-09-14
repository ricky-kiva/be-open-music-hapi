'use strict';

const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSong(req, h) {
    this._validator.validatePayload(req.payload);

    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId
    } = req.payload;

    const songId = await this._service.add({
      title,
      year,
      genre,
      performer,
      duration: duration !== undefined ? duration : null,
      albumId: albumId !== undefined ? albumId : null
    });

    const res = h.response({
      status: 'success',
      data: { songId: songId }
    });

    res.code(201);

    return res;
  }

  async getSongs() {
    const songs = await this._service.getAll();

    return {
      status: 'success',
      data: { songs }
    };
  }

  async getSongById(req, h) {
    const { id } = req.params;
    const song = await this._service.getById(id);

    return h.response({
      status: 'success',
      data: { song }
    });
  }

  async putSongById(req) {
    this._validator.validatePayload(req.payload);

    const { id } = req.params;

    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId
    } = req.payload;

    await this._service.editById(id, {
      title,
      year,
      genre,
      performer,
      duration: duration !== undefined ? duration : null,
      albumId: albumId !== undefined ? albumId : null
    });

    return {
      status: 'success',
      message: 'Song successfully updated'
    };
  }

  async deleteSongById(req) {
    const { id } = req.params;

    await this._service.deleteById(id);

    return {
      status: 'success',
      message: 'Song successfully deleted'
    };
  }
}

module.exports = SongsHandler;
