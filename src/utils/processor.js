import fs from "fs";

import PingCommand from "../commands/ping.js";
import HelpCommand from "../commands/help.js";

const ping = new PingCommand();
const help = new HelpCommand();

const commands = JSON.parse(fs.readFileSync("./data/commands.json"));
const executions = [
  [ping.processCommand, ping],
  [help.processCommand, help],
];

class CommandProcessor {
  static configureSniper(message, type) {
    if (type === "deletedMessage") sniper.storeDeletedMessage(message);
    else sniper.storeOriginalMessage(message);
  }

  static mapCommandExecutions() {
    for (let i = 0; i < commands.length; i++) {
      commands[i].execution = executions[i][0];
      commands[i].object = executions[i][1];
    }
  }

  static processCommand(command, prefix) {
    const [commandName, ...args] = command.content
      .trim()
      .substring(prefix.length)
      .split(/\s+/);

    const parameters = [];
    for (let cmd of commands) {
      if (cmd.alias.includes(commandName.toLowerCase())) {
        const special = this.checkSpecialCommand(commandName);
        parameters.push(cmd.object);
        parameters.push(command);
        if (cmd.hasArgs) parameters.push(args);
        if (special) parameters.push(special);
        cmd.execution(...parameters);
      }
    }
  }
}

export default CommandProcessor;
