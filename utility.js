module.exports = {
  noExtension: (fileName) => fileName.split(".")[0],
  sentimentToText({magnitude, score}) {
    console.log
    return (magnitude > 0.5 &&  score > 0.5) ? "Clearly Positive"
    : (magnitude > 0.5 && score < 0.0) ? "Clearly Negative" 
    : (magnitude < 0.5 && score < 0.2 && score > -0.2) ? "Neautral"
    : (magnitude > 0.5 && score == 0.0) ? "Mixed" : "Unknown";
  }
}