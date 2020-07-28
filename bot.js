const {Collection, Discord, Message, Client, Util} = require('discord.js');
const fs = require('fs');
const bot = new Client({ disableEveryone: true }) 
const YouTube = require('simple-youtube-api')
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;
const ytdl = require('ytdl-core')
const youtube = new YouTube(process.env.GOOGLE_API_KEY)
const queue = new Map()
const ms = require('ms');
const { connect } = require('http2');
const { connection } = require('mongoose');
const dateformat = require('dateformat');
const { error } = require('console');
bot.commands = new Collection();
bot.aliases = new Collection();
bot.catecories = fs.readdirSync("./commands/");
["command"].forEach(handler=>{ 
  require(`./handlers/${handler}`)(bot); 
});
bot.on('ready',()=>{ 
  bot.user.setActivity(`${prefix}help | Nox Bot!`,{type: "STREAMING", url: 'https://twitch.tv/idk'}) 
  console.log(`Hello! ${bot.user.username} is now online!!`) 
})
bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;
  if(message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
      if(!bot.commands.has(command)) return;
      try {
          bot.commands.get(command).run(bot, message, args);
      } catch (error){
          console.error(error);
      }
  }
})
 
bot.on("guildMemberAdd", member =>{
  member.roles.add(member.guild.roles.cache.find(role => role.name == "Nox"), "auto added.");
})

bot.on('message', message => {
  if (true) {
if (message.content === '-botinvite') {
      message.author.send(' https://discord.com/oauth2/authorize?client_id=717385095547191318&scope=bot&permissions=8 | Here is my invite link :)').catch(e => console.log(e.stack));
 
    }
   }
  });
 
 
bot.on('message', luxy => {
if(luxy.author.bot) return;
if(luxy.content === '-botinvite') {
luxy.channel.send('**Check your dms** 📥');
}
});

//////////////////////////////////////////////////////////////////
bot.on("message", message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "help")) {
    if (message.author.id == message.guild.ownerID) {
      message.author
        .send(
          `   
\`General Commands\` 🌍
${prefix}help : to see all the available commands
${prefix}ping : shows the bot's ping
${prefix}uptime : shows for how long the bot has been online
${prefix}avatar : Get your own or someone else's avatar
${prefix}emoji : shows all the available emojis in the server
${prefix}botinvite : to get the bot's invite link




\`Moderation Commands\` ✨
${prefix}giveaway : ${prefix}giveaway <time> <channel id> <prize>
${prefix}clear : deletes multiple messages
${prefix}ban : to ban a member from the server
${prefix}kick : to kick a member from the server
${prefix}dm : to make me send a message to someone in privite
${prefix}poll : Create a simple yes or no poll



\`Music Commands\` 🎵
${prefix}play : plays music
${prefix}stop : stop playing music
${prefix}skip : skips the current playing song
${prefix}pause : pauses playing music
${prefix}resume : resume playing music
${prefix}volume : changes the music volume
${prefix}np : shows the current playing song name
  `
        )
        .then(e => {
          message.react("✅");
        })
        .catch(() => {
          return message.channel
            .send(
              "**You should allow to receive messages in private, so that I can send the commands to you**"
            )
            .then(() => {
              return message.react("❌");
            });
        });
    } else {
      message.author
        .send(
          `   
          \`General Commands\` 🌍
          ${prefix}help : to see all the available commands
          ${prefix}ping : shows the bot's ping
          ${prefix}uptime : shows for how long the bot has been online
          ${prefix}avatar : Get your own or someone else's avatar
          ${prefix}emoji : shows all the available emojis in the server
          ${prefix}botinvite : to get the bot's invite link

          
          
          \`Moderation Commands\` ✨
          ${prefix}giveaway : ${prefix}giveaway <time> <channel id> <prize>
          ${prefix}clear : deletes multiple messages
          ${prefix}ban : to ban a member from the server
          ${prefix}kick : to kick a member from the server
          ${prefix}dm : to make me send a message to someone in privite
          ${prefix}poll : Create a simple yes or no poll


          
          \`Music Commands\` 🎵
          ${prefix}play : plays music
          ${prefix}stop : stop playing music
          ${prefix}skip : skips the current playing song
          ${prefix}pause : pauses playing music
          ${prefix}resume : resume playing music
          ${prefix}volume : changes the music volume
          ${prefix}np : shows the current playing song name
        `
          )
        .then(e => {
          message.react("✅");
        })
        .catch(() => {
          return message.channel
            .send(
              "**You should allow to receive messages in private, so that I can send the commands to you**"
            )
            .then(() => {
              return message.react("❌");
            });
        });
    }
  }
});

//////////////////////////////////////////////////////////////////

  bot.login(process.env.token);