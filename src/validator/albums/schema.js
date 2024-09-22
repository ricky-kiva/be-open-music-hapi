'use strict';

const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().max(255).required(),
  year: Joi.number().required()
});

const AlbumCoverHeadersSchema = Joi
  .object({
    'content-type': Joi
      .string()
      .valid(
        'image/apng',
        'image/avif',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/webp'
      )
      .required()
  })
  .unknown();

module.exports = {
  AlbumPayloadSchema,
  AlbumCoverHeadersSchema
};
