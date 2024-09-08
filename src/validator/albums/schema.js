'use strict';

const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().max(255).required(),
  year: Joi.number().required()
});

module.exports = { AlbumPayloadSchema };
