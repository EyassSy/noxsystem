const {Collection, Discord, Message, Client, Util} = require('discord.js');
const fs = require('fs');
const bot = new Client({ disableEveryone: true }) 
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;
const ytdl = require('ytdl-core')
const queue = new Map()
const ms = require('ms');
const { connect } = require('http2');
const { connection } = require('mongoose');
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
${prefix}avatar : Get your own or someone else's avatar




\`Moderation Commands\` ✨

${prefix}giveaway : ${prefix}giveaway <time> <channel id> <prize>
${prefix}clear : deletes multiple messages
${prefix}ban : to ban a member from the server
${prefix}kick : to kick a member from the server
${prefix}dm : to make me send a message to someone in privite
${prefix}poll : Create a simple yes or no poll


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
          ${prefix}avatar : Get your own or someone else's avatar
          
          
          
          \`Moderation Commands\` ✨

          ${prefix}giveaway : ${prefix}giveaway <time> <channel id> <prize>
          ${prefix}clear : deletes multiple messages
          ${prefix}ban : to ban a member from the server
          ${prefix}kick : to kick a member from the server
          ${prefix}dm : to make me send a message to someone in privite
          ${prefix}poll : Create a simple yes or no poll


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

bot.on('message', async message => {
  if(message.author.bot) return
  if(!message.content.startsWith(prefix)) return

  const args = message.content.substring(prefix.length).split(" ")
  const serverQueue = queue.get(message.guild.id)

  if(message.content.startsWith(`${prefix}play`)) {
    const voiceChannel = message.member.voice.channel
    if(!voiceChannel) return message.channel.send("You need to be in a voice channel to play music")
    const permissions = voiceChannel.permissionsFor(message.client.user)
    if(!permissions.has('CONNECT')) return message.channel.send("I don\'t have permissions to connect to the voice channel")
    if(!permissions.has('SPEAK')) return message.channel.send("I don\'t have permissions to speak in the channel")

    const songInfo = await ytdl.getInfo(args[1])
    const song = {
      title: Util.escapeMarkdown(songInfo.title),
      url: songInfo.video_url
    }

    if(!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      }
      queue.set(message.guild.id, queueConstruct)

      queueConstruct.songs.push(song) 

      try {
        var connection = await voiceChannel.join()
        queueConstruct.connection = connection
        play(message.guild, queueConstruct.songs[0])
    } catch (error) {
        console.log(`There was an error connecting to the voice channel: ${error}`)
        queue.delete(message.guild.id)
        return message.channel.send(`There was an error connecting to the voice channel: ${error}`)
    }
  } else {
    serverQueue.songs.push(song)
    return message.channel.send(`**${song.title}** has been added to the queue`)
  }
  return undefined
  } else if(message.content.startsWith(`${prefix}stop`)) {
    if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to stop the music")
    if(!serverQueue) return message.channel.send("There is nothing playing")
    serverQueue.songs = []
    serverQueue.connection.dispatcher.end()
    message.channel.send("I have stoped the music for you")
    return undefined
  } else if(message.content.startsWith(`${prefix}skip`)) {
    if(!message.member.voice.channel) return message.channel.send("You have to be in a voice channel to skip the music")
    if(!serverQueue) return message.channel.send("There is nothing playing")
    serverQueue.connection.dispatcher.end()
    message.channel.send("I have skipped the music for you")
    return undefined
   } else if(message.content.startsWith(`${prefix}volume`)) {
     if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use music commands")
     if(!serverQueue) return message.channel.send("There is nothing playing")
     if(!args[1]) return message.channel.send(`That volume is: **${serverQueue.volume}**`)
     if(isNaN(args[1])) return message.channel.send("That is not a vaild amount to change the volume to")
     serverQueue.volume = args[1]
     serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5)
     message.channel.send(`I have changed the volume to: **${args[1]}**`)
     return undefined
   } else if(message.content.startsWith(`${prefix}np`)) {
     if(!serverQueue) return message.channel.send("There is nothing playing")
     message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`)
     return undefined
   } else if(message.content.startsWith(`${prefix}queue`)) {
     if(!serverQueue) return message.channel.send("There is nothing playing")
     message.channel.send(`
__**Song Queue:**__
${serverQueue.songs.Map(song => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
        `, { split: true })
        return undefined
    } else if(message.content.startsWith(`${prefix}pause`)) {
      if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use the pause command")
      if(!serverQueue) return message.channel.send("There is nothing playing")
      if(!serverQueue.playing) return message.channel.send("The Music is already paused")
      serverQueue.playing = false
      serverQueue.connection.dispatcher.pause()
      message.channel.send("I have now paused the music for you")
      return undefined
   } else if (message.content.startsWith(`${prefix}resume`)) {
     if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use the resume command")
     if(!serverQueue) return message.channel.send("There is nothing playing")
     serverQueue.playing = true
     serverQueue.connection.dispatcher.resume()
     message.channel.send("I have now resumed the music for you")
     return undefined
   }
})

function play(guild, song) {
  const serverQueue = queue.get(guild.id)

  if(!song) {
    serverQueue.voiceChannel.leave()
    queue.delete(guild.id)
    return
  }

  const dispatcher = serverQueue.connection.play(ytdl(song.url))
  .on('finish', () => {
    serverQueue.songs.shift()
    play(guild, serverQueue.songs[0])
  })
  .on('error', error => {
    console.log(error)
  })
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)

  serverQueue.textChannel.send(`Start Playing: **${song.title}**`)
}

//////////////////////////////////////////////////////////////////

  bot.login(process.env.token);