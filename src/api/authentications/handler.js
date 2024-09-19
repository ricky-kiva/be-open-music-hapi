'use strict';

const autoBind = require('auto-bind');

class AuthsHandler {
  constructor(authsService, usersService, tokenManager, validator) {
    this._authsService = authsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuth(req, h) {
    this._validator.validatePostPayload(req.payload);

    const { username, password } = req.payload;

    const id = await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authsService.addRefreshToken(refreshToken);

    const res = h.response({
      status: 'success',
      data: { accessToken, refreshToken }
    });

    res.code(201);

    return res;
  }

  async putAuth(req) {
    this._validator.validatePutPayload(req.payload);

    const { refreshToken } = req.payload;

    await this._authsService.verifyRefreshToken(refreshToken);

    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      data: { accessToken }
    };
  }

  async deleteAuth(req) {
    this._validator.validateDeletePayload(req.payload);

    const { refreshToken } = req.payload;

    await this._authsService.verifyRefreshToken(refreshToken);
    await this._authsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh Token successfully deleted'
    };
  }
}

module.exports = AuthsHandler;
