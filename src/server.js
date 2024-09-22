'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const config = require('./utils/config');
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const StorageService = require('./services/storage/StorageService');
const AlbumsValidator = require('./validator/albums');
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const auths = require('./api/authentications');
const AuthsService = require('./services/postgres/AuthsService');
const AuthsValidator = require('./validator/auths');
const TokenManager = require('./tokenize/TokenManager');
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const coverUploadPath = path.resolve(__dirname, 'api/albums/cover');

  const albumsService = new AlbumsService();
  const storageService = new StorageService(coverUploadPath);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authsService = new AuthsService();
  const playlistsService = new PlaylistsService(usersService);
  const playlistSongsService = new PlaylistSongsService(songsService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*']
      }
    },
    debug: {
      request: ['error']
    }
  });

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        });

        newResponse.code(response.statusCode);

        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Internal Server Error'
      });

      newResponse.code(500);

      return newResponse;
    }

    return h.continue;
  });

  await server.register({ plugin: Jwt });

  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: config.jwt.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.tokenAge
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        storageService,
        validator: AlbumsValidator
      }
    }, {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    }, {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    }, {
      plugin: auths,
      options: {
        authsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthsValidator
      }
    }, {
      plugin: playlists,
      options: {
        playlistsService,
        playlistSongsService,
        validator: PlaylistsValidator
      }
    }, {
      plugin: _exports,
      options: {
        producerService: ProducerService,
        playlistsService,
        validator: ExportsValidator
      }
    }
  ]);

  await server.start();

  // eslint-disable-next-line no-console
  console.log(`Server is running on ${server.info.uri}`);
};

init();
