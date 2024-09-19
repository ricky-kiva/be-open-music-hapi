'use strict';

const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const q = {
      text: 'INSERT INTO auths VALUES($1)',
      values: [token]
    };

    await this._pool.query(q);
  }

  async verifyRefreshToken(token) {
    const q = {
      text: 'SELECT token FROM auths WHERE token = $1',
      values: [token]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token is not valid');
    }
  }

  async deleteRefreshToken(token) {
    const q = {
      text: 'DELETE FROM auths WHERE token = $1',
      values: [token]
    };

    await this._pool.query(q);
  }
}

module.exports = AuthsService;
