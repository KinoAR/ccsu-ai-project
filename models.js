const {rule, model} = require("./model-rules");
const utils = require("./utility");
const fs = require("fs");
const chalk = require("chalk");
module.exports = {
  createFile(transcription) {
    //(create && file && named)
    const myModel = model([rule(/create/ig), rule(/file/ig), rule(/named|name/)])
    if(myModel(transcription)) {
      const fileName = utils.splitNamed(transcription);
      fs.writeFileSync(`${fileName}.txt`);
      console.log(
        chalk.magenta.bgBlack.underline(`${fileName}.txt written to disk.`)
      );
    }
  },
  readFile(transcription) {
    const myModel = model([rule(/read/ig), rule(/file/ig), rule(/named|name/ig)]);
    if(myModel(transcription)) {
      const fileName = utils.splitNamed(transcription);
      const fileContents = fs.readFileSync(`${fileName}.txt`);
      console.log(fileContents);
    }
  }
};