'use strict';

const routes = (h) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: h.postExportPlaylist,
    options: {
      auth: 'open_music_jwt'
    }
  }
];

module.exports = routes;
