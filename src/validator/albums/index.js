'use strict';

const {
  AlbumPayloadSchema,
  AlbumCoverHeadersSchema
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
  validatePayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateCoverHeaders: (headers) => {
    const validationResult = AlbumCoverHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = AlbumsValidator;
