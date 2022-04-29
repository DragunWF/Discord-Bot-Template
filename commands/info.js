import fs from "fs";
import Command from "../utils/command.js";

class InfoCommand extends Command {
  #author;
  #description;

  constructor() {
    super();
    this.#author = JSON.parse(
      fs.readFileSync("./config/bot.json")
    )[0].creatorTag;
    this.#description = `
Add a description here, **${this.#author}**.
`;
  }

  executeCommand(message) {
    const embed = new this.MessageEmbed()
      .setColor(this.mainColor)
      .setAuthor({
        name: this.#author,
      })
      .setTitle("Bot Information")
      .setDescription(this.#description)
      .setFooter({ text: "Have a nice day!" });
    message.channel.send({ embeds: [embed] });
  }
}

export default InfoCommand;
