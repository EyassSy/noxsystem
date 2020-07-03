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

let user = message.mentions.users.first() || message.author; // You can do it by mentioning the user, or not.
    
if (user.presence.status === "dnd") user.presence.status = "Do Not Disturb";
if (user.presence.status === "idle") user.presence.status = "Idle";
if (user.presence.status === "offline") user.presence.status = "Offline";
if (user.presence.status === "online") user.presence.status = "Online";

function game() {
  let game;
  if (user.presence.activities.length >= 1) game = `${user.presence.activities[0].type} ${user.presence.activities[0].name}`;
  else if (user.presence.activities.length < 1) game = "None"; // This will check if the user doesn't playing anything.
  return game; // Return the result.
}

let x = Date.now() - user.createdAt; // Since the user created their account.
let y = Date.now() - message.guild.members.cache.get(user.id).joinedAt; // Since the user joined the server.
let created = Math.floor(x / 86400000); // 5 digits-zero.
let joined = Math.floor(y / 86400000);

const member = message.guild.member(user);
let nickname = member.nickname !== undefined && member.nickname !== null ? member.nickname : "None"; // Nickname
let createdate = moment.utc(user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss"); // User Created Date
let joindate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss"); // User Joined the Server Date
let status = user.presence.status; // DND, IDLE, OFFLINE, ONLINE
let avatar = user.avatarURL({size: 2048}); // Use 2048 for high quality avatar.

const embed = new Discord.MessageEmbed()
.setAuthor(user.tag, avatar)
.setThumbnail(avatar)
.setTimestamp()
.setColor(0x7289DA)
.addField("ID", user.id, true)
.addField("Nickname", nickname, true)
.addField("Created Account Date", `${createdate} \nsince ${created} day(s) ago`, true)
.addField("Joined Guild Date", `${joindate} \nsince ${joined} day(s) ago`, true)
.addField("Status", status, true)
.addField("Game", game(), true)

message.channel.send(embed);



  bot.login(process.env.token);