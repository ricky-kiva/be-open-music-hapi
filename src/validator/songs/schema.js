'use strict';

const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().max(255).required(),
  year: Joi.number().required(),
  genre: Joi.string().max(100).required(),
  performer: Joi.string().max(255).required(),
  duration: Joi.number(),
  albumId: Joi.string().max(36)
});

module.exports = { SongPayloadSchema };
