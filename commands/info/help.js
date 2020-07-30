const config = require('./config.json');
const prefix = config.prefix;

module.exports = {
    name: "help",
    description: "View all the commands the bot has",
    category: "info",
    run: async (bot, message, args) => {
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
      ${prefix}userinfo : Shows the information of a member/user
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
                ${prefix}userinfo : Shows the information of a member/user
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
      }
    }; 