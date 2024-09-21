'use strict';

const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required()
});

const PostPlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().required()
});

const DeletePlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().required()
});

module.exports = {
  PlaylistPayloadSchema,
  PostPlaylistSongsPayloadSchema,
  DeletePlaylistSongsPayloadSchema
};
