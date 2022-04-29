import "dotenv/config";
import fs from "fs";
import Discord from "discord.js";

import CommandProcessor from "./utils/command-processor.js";
import keepServerRunning from "./utils/server.js";

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const settings = JSON.parse(fs.readFileSync("./config/bot.json"))[0];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(settings.activity.text, {
    type: settings.activity.type.toUpperCase(),
  });
  CommandProcessor.onReady();
});

client.on("messageCreate", (message) => {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith(settings.prefix))
      CommandProcessor.processCommand(message, settings.prefix);
    // Add more code here
  } catch (error) {
    message.channel.send("**An unknown error has occured**");
    console.log(error);
  }
});

client.on("messageDelete", (message) => {
  try {
    if (message.author.bot) return;
    // Add code here
  } catch (error) {
    console.log(error);
  }
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  try {
    if (oldMessage.author.bot) return;
    // Add code here
  } catch (error) {
    console.log(error);
  }
});

keepServerRunning();
client.login(process.env.TOKEN);
