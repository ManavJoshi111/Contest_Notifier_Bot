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
const userOffset = new Date().getTimezoneOffset() * 60 * 1000;
const dateToTime = date => date.toLocaleString('en-US', {
  hour: 'numeric',
  minute: 'numeric'
});

const dotenv = require('dotenv');
dotenv.config();
var http = require('http'); http.createServer(function (req, res) { res.write("Bot is running now"); res.end(); }).listen(8080);

const getContest = async () => {
  const data = await fetch("https://kontests.net/api/v1/all");
  const dataJson = await data.json();
  return dataJson;
}

const sendReminder = async () => {
  const contests = await getContest();
  for (var contest in contests) {
    if (contests[contest].in_24_hours == "Yes") {
      let dateString = contests[contest].start_time;
      let localDate = new Date(dateString);
      var message = `New Contest Details : \nContest Name : ${contests[contest].name}\nPlatform : ${contests[contest].site}\nDate : ${localDate.getDate()} ${localDate.getMonth()} ${localDate.getFullYear()}\nTime : ${dateToTime(localDate)}\nLink : ${contests[contest].url}`;

      client.channels.cache.find(channel => channel.name === 'general').send(message);
    }
  }
}
client.on("ready", () => {
  console.log("I'm ready and logged in as ", client.user.tag);

  setInterval(() => {
    sendReminder();
  }, 1000 * 60 * 60 * 2);
})

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
  if (msg.content === "contest") {
    const contests = await getContest();
    for (var contest in contests) {
      if (contests[contest].in_24_hours == "Yes") {
        let dateString = contests[contest].start_time;
        let localDate = new Date(dateString);
        let utcDate = localDate.getTime() + userOffset;

        console.log("In 24 hours : ", contests[contest]);
        var message = `${contests[contest].site} , is having contest named : ,${contests[contest].name}, at : ,${contests[contest].start_time}`;
        msg.channel.send(message);
      }
    }

  }
})

client.login(process.env['TOKEN']);