'use strict';

const playlistsPath = '/playlists';

const routes = (h) => [
  {
    method: 'POST',
    path: playlistsPath,
    handler: h.postPlaylist,
    options: { auth: 'open_music_jwt' }
  }, {
    method: 'GET',
    path: playlistsPath,
    handler: h.getPlaylists,
    options: { auth: 'open_music_jwt' }
  }, {
    method: 'DELETE',
    path: `${playlistsPath}/{id}`,
    handler: h.deletePlaylistById,
    options: { auth: 'open_music_jwt' }
  }
];

module.exports = routes;