const rule = (ruleLogic) => (transcription) => ruleLogic.test(transcription);
const worldModel = (ruleList) => (transcription) => ruleList.every(rule => rule(transcription));

module.exports = {
  rule: rule,
  model: worldModel
}