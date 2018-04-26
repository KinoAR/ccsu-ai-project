const {rule, model} = require("./model-rules");
const fs = require("fs");

module.exports = {
  createFile(transcription) {
    //(create && file && named)
    const myModel = model([rule(/create/ig), rule(/file/ig), rule(/named|name/)])
    if(myModel(transcription)) {
      const fileName = transcription
        .split("named")[1].trim().toLowerCase();
        console.log(fileName);
      fs.writeFileSync(`${fileName}.txt`);
    }
  }
};