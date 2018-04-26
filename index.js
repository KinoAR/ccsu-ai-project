const fs = require("fs");
const chalk = require("chalk");
const figlet = require("figlet");
const clear = require("clear");
const speechClient = require("./speech-client");
const languageClient = require("./language-client");
const micClient = require("./mic");
const audioTransformer = require("./audio-transformer");
const utils = require("./utility");

const speechToText = (fileName) => {
  audioTransformer.mp3ToFlacMono(fileName)
    .then(value => {
      speechClient.transcribe(value)
        .then(transcription => {
          console.log(
            chalk.white.bgBlack.bold(transcription)
          );
          languageClient.analyzeSentiments(transcription)
            .then(sentiments => {
              console.log(
                chalk.white.bgBlack.bold(
                  utils.sentimentToText(sentiments)
                )
              );
              fs.unlinkSync(fileName);
              if (!/exit/ig.test(transcription)) {
                
              } else {
                //Kill the process
              }
            }).catch(err => {
              console.error(err);
            });
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

clear();
console.log(
  chalk.magenta.bgBlack.bold(
    figlet.textSync("Senestra", { horizontalLayout: 'full' })
  )
);

micClient.micToMp3("temp.mp3")
  .then((fileName) => {
    speechToText(fileName);
  }).catch((err) => {
    console.error(err);
  });
