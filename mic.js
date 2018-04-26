const mic = require("mic");
const fs = require("fs");
const chalk = require("chalk");
const Spinner = require("cli-spinner").Spinner;
module.exports = {
  micToMp3(fileName) {
    return new Promise((resolve, reject) => {
      const spinner = new Spinner(
        chalk.green.bgBlack.bold("%s Processing... ")
      );
      spinner.setSpinnerString(8);
      const micInstance = mic({
        rate: "44100",
        channels: "2",
        fileType: 'mp3',
        exitOnSilence: 6
      });
      const inputStream = micInstance.getAudioStream();
      const outStream = this.createOutStream(fileName);
      inputStream.pipe(outStream);

      inputStream.on('error', (err) => {
        console.error(err);
        reject(err);
      });

      inputStream.on('startComplete', () => {
        console.log(
          chalk.green.bgBlack.bold("MIC STARTED")
        );
        spinner.start();
        setTimeout(() => {
          micInstance.stop();
        }, 6000)
      });

      inputStream.on('stopComplete', () => {
        console.log(
          chalk.green.bgBlack.bold("MIC STOPPED")
        );
      });

      inputStream.on("pauseComplete", () => {
        console.log(
          chalk.green.bgBlack.bold("MIC PAUSE")
        );
      });

      inputStream.on("resumeComplete", () => {
        console.log("MIC RESUME");
      });

      inputStream.on('silence', () => {
        console.log("MIC SILENCE");
      });

      inputStream.on("processExitComplete", () => {
        console.log("MIC PROCESS EXIT");
      });

      outStream.on("finish", () => {
        console.log(
          chalk.green.bgBlack.bold("Recording Ended")
        );
        spinner.stop();
        resolve(fileName);
      });
      //Start Mic Operations
      micInstance.start();
    });
  },
  createOutStream(fileName) {
    return fs.createWriteStream(fileName);
  }
};