const language = require("@google-cloud/language");

const client = new language.LanguageServiceClient({
  projectId: 'ccsu-ai-project',
  keyFilename: './CCSU AI project-7a92bbdcdee7.json'
});

module.exports = {
  analyzeSentiments(text) {
    return new Promise((resolve, reject) => {
      const document = {
        content: text,
        type:"PLAIN_TEXT"
      };
      client
        .analyzeSentiment({ document })
        .then(results => {
          const sentiment = results[0].documentSentiment;
          resolve(sentiment);
        }).catch(err => {
          console.error('Error: ', err);
          reject(err);
        });
    })
  }
}