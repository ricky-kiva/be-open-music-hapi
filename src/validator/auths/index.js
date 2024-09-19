'use strict';

const {
  PostAuthPayloadSchema,
  PutAuthPayloadSchema,
  DeleteAuthPayloadSchema
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthsValidator = {
  validatePostPayload: (payload) => {
    const validationResult = PostAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutPayload: (payload) => {
    const validationResult = PutAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeletePayload: (payload) => {
    const validationResult = DeleteAuthPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = AuthsValidator;
