const ffmpeg = require("fluent-ffmpeg");
const path = require('path');
const utils = require("./utility");
module.exports = {
  mp3ToFlacMono(fileName) {
    const outFile = `${utils.noExtension(fileName)}-mono.flac`;
    return new Promise((resolve, reject) => {
      ffmpeg(path.resolve(fileName))
        .audioChannels(1)
        .save(outFile)
        .on('error', (err) => {
          console.error(err);
          reject(err);
        })
        .on('end', () => {
          console.log("Done");
          resolve(outFile);
        });
    });
  }
};