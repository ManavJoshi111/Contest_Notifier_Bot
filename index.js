const fetch = require('node-fetch');
const { Client, GatewayIntentBits } = require('discord.js');
const CronJob = require('cron').CronJob;
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const userOffset = new Date().getTimezoneOffset() * 60 * 1000;
const dateToTime = (date) =>
  date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' });

const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
http
  .createServer(function(req, res) {
    res.write('Bot is running now');
    res.end();
  })
  .listen(8080);

const getContest = async () => {
  const data = await fetch('https://kontests.net/api/v1/all');
  const dataJson = await data.json();
  return dataJson;
};

const sendReminder = async () => {
  console.log('In send reminder');
  const contests = await getContest();

  for (const contest of contests) {
    if (contest.in_24_hours === 'Yes') {
      const localDate = new Date(contest.start_time).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const localTime = new Date(contest.start_time).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      const message = `New Contest Details:\nContest Name: ${contest.name}\nPlatform: ${contest.site}\nDate: ${localDate}\nTime: ${localTime}\nLink: ${contest.url}`;

      client.channels.cache
        .find((channel) => channel.name === 'general')
        .send(message);
    }
  }
};



client.on('ready', () => {
  console.log("I'm ready and logged in as ", client.user.tag);

  const job = new CronJob('0 0 * * * *', () => {
    console.log('in interval');
    sendReminder();
  });

  job.start();
});

client.login(process.env['TOKEN']);
