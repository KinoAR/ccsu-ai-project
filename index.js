const fs = require("fs");
const mic = require("mic");
const speechClient = require("./speech-client");
const languageClient = require("./language-client");
const audioTransformer = require("./audio-transformer");
const utils = require("./utility");

const micInstance = mic({ 
  rate: "441000",
  channels: "2",
  debug: true,
  fileType: 'mp3',
  exitOnSilence: 6
});

const createOutStream = (fileName) => fs.WriteStream(fileName);
const inputStream = micInstance.getAudioStream(); 
const outStream = createOutStream("temp.mp3");
const speechToText = (fileName) => {
  audioTransformer.mp3ToFlacMono(fileName)
    .then(value => {
      speechClient.transcribe(value)
        .then(transcription => {
          console.log(transcription);
          languageClient.analyzeSentiments(transcription)
            .then(sentiments => {
              console.log(utils.sentimentToText(sentiments));
              if (!/exit/ig.test(transcription)) {
                inputStream.pipe(createOutStream(fileName));
                micInstance.resume();
              } else {
                micInstance.stop();
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

inputStream.pipe(outStream);

inputStream.on('data', (data) => {
  // console.log(data.length);
});
inputStream.on('error', (err) => {
  console.error(err);
});

inputStream.on('startComplete', () => {
  console.log("SIGNAL START");
  setTimeout(() => {
    micInstance.pause();
  }, 6000);
});

inputStream.on('stopComplete', () => {
  console.log("SIGNAL STOP");
});

inputStream.on('pauseComplete', () => {
  console.log("SIGNAL PAUSE");
  setTimeout(() => {
    speechToText("temp.mp3");
  }, 2000);
});

inputStream.on('resumeComplete', () => {
  console.log("SIGNAL RESUME")
  setTimeout(() => {
    micInstance.pause();
  }, 6000);
});

inputStream.on('silence', () => {
  console.log("SIGNAL SILENCE");
  setTimeout(() => {
    micInstance.stop();
  }, 3000);
});

inputStream.on('processExitComplete', () => {
  console.log("SIGNAL PROCESS EXIT");
});

outStream.on('end', () => {
  console.log("Recording Ended");
});

//Start Mic Operations
micInstance.start();