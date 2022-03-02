import "dotenv/config";
import Discord from "discord.js";

import CommandProcessor from "./utils/processor.js";
import keepServerRunning from "./utils/server.js";

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "!";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("The Galaxy [$help]", {
    type: "WATCHING",
    url: "https://dragonwf.netlify.app/",
  });
  CommandProcessor.mapCommandExecutions();
});

client.on("messageCreate", (message) => {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix))
      CommandProcessor.processCommand(message, prefix);
  } catch (error) {
    message.channel.send("**An unknown error has occured**");
    console.log(error);
  }
});

client.on("messageDelete", (message) => {
  if (message.author.bot) return;
  // Add code here
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  // Add code here
});

keepServerRunning();
client.login(process.env.TOKEN);
