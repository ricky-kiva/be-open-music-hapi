'use strict';

const fs = require('fs');

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = `cover-${+new Date()}-${meta.filename}`;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (e) => reject(e));

      file.pipe(fileStream);

      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
