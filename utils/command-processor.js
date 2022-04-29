import fs from "fs";

import PingCommand from "../commands/ping.js";
import HelpCommand from "../commands/help.js";
import InfoCommand from "../commands/info.js";

class CommandProcessor {
  static #commands = JSON.parse(fs.readFileSync("./config/commands.json"));
  static #commandExecutions = [
    { name: "ping", object: new PingCommand() },
    { name: "help", object: new HelpCommand() },
    { name: "info", object: new InfoCommand() },
  ];
  static #settings = JSON.parse(fs.readFileSync("./config/bot.json"))[0];

  static onReady() {
    let helpCommandIndex;
    for (let i = 0; i < this.#commandExecutions.length; i++)
      if (this.#commandExecutions[i].name === "help") helpCommandIndex = i;

    this.#commandExecutions[helpCommandIndex].object.fillCommandList(
      this.#commands
    );
    this.#mapCommandExecutions();
  }

  static processCommand(command, client) {
    const [commandName, ...args] = command.content
      .trim()
      .substring(this.#settings.prefix.length)
      .split(/\s+/);

    const parameters = [];
    for (let cmd of this.#commands) {
      if (cmd.alias.includes(commandName.toLowerCase())) {
        parameters.push(command);
        if (cmd.hasClientObject) parameters.push(client);
        if (cmd.hasArgs) {
          if (!args.length) {
            command.channel.send("You forgot to add an argument!");
            break;
          }
          parameters.push(args);
        }
        cmd.object.executeCommand(...parameters);
        break;
      }
    }
  }

  static #mapCommandExecutions() {
    this.#commands.sort((a, b) => a.name.localeCompare(b.name));
    this.#commandExecutions.sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < this.#commands.length; i++)
      this.#commands[i].object = this.#commandExecutions[i].object;
  }
}

export default CommandProcessor;
