const fs = require("fs");
const chalk = require("chalk");
const figlet = require("figlet");
const clear = require("clear");
const speechClient = require("./speech-client");
const languageClient = require("./language-client");
const micClient = require("./mic");
const audioTransformer = require("./audio-transformer");
const utils = require("./utility");
const AI = require("./models");
const interface = require("./questions");

const speechToText = (fileName, command) => {
  return new Promise((resolve, reject) => {
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
                  AI.createFile(transcription);
                  AI.readFile(transcription);
                  AI.deleteFile(transcription);
                  resolve("Complete");
                } else {
                  //Kill the process
                  console.log(
                    chalk.magenta.bgBlack.bold(
                      "Goodbye"
                    )
                  );
                }
              }).catch(err => {
                reject(err);
                console.error(err);
              });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

clear();
console.log(
  chalk.magenta.bgBlack.bold(
    figlet.textSync("Evelynn", { horizontalLayout: 'full' })
  )
);

const startInterface = () => {
  return new Promise((resolve, reject) => {
    interface.startInterface().then(response => {
      const { interface } = response;
      if (interface === 'Enter Command') {
        micClient.micToMp3("temp.mp3")
          .then((fileName) => {
            speechToText(fileName)
              .then(val => {
                resolve(interface); //Enter Command or Exit
              });
          }).catch((err) => {
            console.error(err);
          });
      } else {
        clear();
        console.log(
          chalk.magenta.bgBlack.bold(
            figlet.textSync("Goodbye", {horizontalLayout: 'full'})
          )
        );
      }
    });
  });
}

async function runInterface (command)  {
  if(command === 'Exit') {
    //Exit
  } else {
    const result = await startInterface();
    runInterface(result);
  }
};

runInterface('start');