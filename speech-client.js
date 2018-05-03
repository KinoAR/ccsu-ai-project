const speech = require("@google-cloud/speech");
const fs = require("fs");
const path = require("path");

const client = new speech.SpeechClient({
  projectId: 'ccsu-ai-project',
  keyFilename:'./CCSU AI project-7a92bbdcdee7.json'
});
//Google Speech API Only Supports 1 Audio Channel
const configAudio = (fileName) => {
  return /.flac/ig.test(fileName) ? 
  {
      encoding: 'FLAC',
      languageCode: 'en-US'
  } : {
    encoding: 'LINEAR16',
    languageCode: 'en-US'
  };
}

module.exports = {
  transcribe(fileName) {
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');
    const config = configAudio(fileName);
    const audio = {
      content: audioBytes
    };
    const request = {
      audio,
      config
    };
    return new Promise((resolve, reject) => {
      client
        .recognize(request)
        .then(data => {
          const response = data[0];
          const transcription = response.results
            .map( result => result.alternatives[0].transcript)
            .join("\n");
            resolve(transcription);
        })
        .catch(err => {
          console.error('Error:', err);
          reject(err);
        });
    });
  }
};