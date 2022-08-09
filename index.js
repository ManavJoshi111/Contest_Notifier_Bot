const Discord = require('discord.js');
const fetch = require('node-fetch');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  'intents': [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const dotenv = require('dotenv');
dotenv.config();
var http = require('http'); http.createServer(function(req, res) { res.write("Bot is running now"); res.end(); }).listen(8080);

const getContest = async () => {
  const data = await fetch("https://kontests.net/api/v1/all");
  const dataJson = await data.json();
  return dataJson;
}

const sendReminder = async () => {
  const contests = await getContest();
  for (var contest in contests) {
    if (contests[contest].in_24_hours == "Yes") {
      console.log("In 24 hours : ", contests[contest]);
      var message = `New Contest Details : \nContest Name : ${contests[contest].name}\nPlatform : ${contests[contest].site}\n Date : \nTime ${contests[contest].start_time}:\nLink : ${contests[contest].url}`;
      client.channels.cache.find(channel => channel.name === 'general').send(message);
    }
  }
}
client.on("ready", () => {
  console.log("I'm ready and logged in as ", client.user.tag);

  setInterval(() => {
    sendReminder();
  }, 1000 * 60*60*2);
})

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
  if (msg.content === "ping") {
    msg.reply("pong");
  }
  if (msg.content === "contest") {
    const contests = await getContest();
    for (var contest in contests) {
      if (contests[contest].in_24_hours == "Yes") {
        console.log("In 24 hours : ", contests[contest]);
        var message = `${contests[contest].site} , is having contest named : ,${contests[contest].name}, at : ,${contests[contest].start_time}`;
        msg.channel.send(message);
      }
    }

  }
})

client.login(process.env['TOKEN']);