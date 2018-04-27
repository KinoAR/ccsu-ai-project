const inquirer = require("inquirer");

module.exports = {
  startInterface() {
    const question = {
      type: 'list',
      name: 'interface',
      message: "What would you like to do?",
      choices: ['Enter Command', 'Exit']
    };
    return inquirer.prompt(question);
  }
}