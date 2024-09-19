'use strict';

const playlistsPath = '/playlists';

const routes = (h) => [
  {
    method: 'POST',
    path: playlistsPath,
    handler: h.postPlaylist,
    options: { auth: 'open_music_jwt' }
  }
];

module.exports = routes;
