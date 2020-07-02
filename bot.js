const {Collection, Discord, Message, Client} = require('discord.js');
const fs = require('fs');
const bot = new Client({
  disableEveryone: true
}) 
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;
const ytdl = require('ytdl-core')
const ms = require('ms');
const { connect } = require('http2');
const { connection } = require('mongoose');
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

//////////////////////////////////////////////////////////////////

bot.on("message", message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + "help")) {
    if (message.author.id == message.guild.ownerID) {
      message.author
        .send(
          `   
\`General Commands\` 🌍

${prefix}help :to see all the available commands
${prefix}ping :shows the bot's ping



\`Moderation Commands\` ✨

${prefix}clear : deletes multiple messages
${prefix}ban : to ban a member from the server
${prefix}kick : to kick a member from the server
${prefix}dm : to make me send a message to someone in privite

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
          
          
          
          \`Moderation Commands\` ✨

          ${prefix}clear : deletes multiple messages
          ${prefix}ban : to ban a member from the server
          ${prefix}kick : to kick a member from the server
          ${prefix}dm : to make me send a message to someone in privite

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

bot.on('message', async message =>{
  if(message.author.bot) return
  if(!message.content.startsWith(prefix)) return

  const args = message.content.substring(prefix.length).split(" ")
  
  if(message.content.startsWith(`${prefix}play`)) {
    const voicechannel = message.member.voice.channel
    if(!voicechannel) return message.channel.send('You need to be in a voice channel to play music')
    const permissions = voicechannel.permissionsFor(message.client.user)
    if(!permissions.has('CONNECT')) return message.channel.send("I don\'t have permissions to connect to the voice channel")
    if(!permissions.has('SPEAK')) return message.channel.send("I don\'t have permissions to speak in the channel")

    try {
      var conection = await voicechannel.join()
    } catch (error) {
      console.log(`There was an error connecting to the voice channel: ${error}`)
      return message.channel.send(`There was an error connecting to the voice channel: ${error}`)
    }

    const dispatcher = connection.play(ytdl(args[1]))
    .on('finish', () => {
      voicechannel.leave()
    })
    .on('error', error => {
      console.log(error)
    })
    dispatcher.setVolumeLogarithmic(5 / 5)
    } else if (message.content.startsWith(`${prefix}stop`)) {
      if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to stop the music")
      message.member.voice.channel.leave()
      return undefined
  }
})

//////////////////////////////////////////////////////////////////

  bot.login(process.env.token);