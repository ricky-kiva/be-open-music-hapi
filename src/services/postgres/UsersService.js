'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async add({ username, password, fullname }) {
    await this.verifyUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const q = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname]
    };

    const result = await this._pool.query(q);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add user');
    }

    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const q = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    };

    const result = await this._pool.query(q);

    if (result.rows.length > 0) {
      throw new InvariantError('Failed to add user. Username is used');
    }
  }
}

module.exports = UsersService;