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

var http = require('http');
http.createServer(function(req, res) {
  res.write("Bot is running now");
  res.end();
}).listen(8080);

const getContest = async () => {
  const data = await fetch("https://kontests.net/api/v1/all");
  const dataJson = await data.json();
  return dataJson;
}

const sendReminder = async () => {
  console.log("In send reminder");
  const contests = await getContest();
  for (var contest in contests) {
    if (contests[contest].in_24_hours == "Yes") {
      let dateString = contests[contest].start_time;
      let localDate = new Date(dateString).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
      let timeString = localDate.split(' ')[1];
      let localDateString = localDate.split(' ')[0];
      console.log(timeString);
      console.log(localDateString);
      // ${localDate.getMonth()} ${localDate.getFullYear()}
      var message = `New Contest Details : \nContest Name : ${contests[contest].name}\nPlatform : ${contests[contest].site}\nDate : ${localDateString}\nTime : ${timeString}\nLink : ${contests[contest].url}`;

      client.channels.cache.find(channel => channel.name === 'general').send(message);
    }
  }
}

client.on("ready", () => {
  console.log("I'm ready and logged in as ", client.user.tag);

  setInterval(() => {
    console.log("in interval");
    sendReminder();
  }, 1000 * 60 * 12);
})

client.login(process.env['TOKEN']);
