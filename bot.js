const {Collection, Discord, Message, Client} = require('discord.js');
const fs = require('fs');
const bot = new Client({
   disableEveryone: true
  }) 
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;
const ms = require('ms');
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

bot.on('message', async message=>{ 
  if(message.author.bot) return; 
  if(!message.content.startsWith(prefix)) return; 
  if(!message.guild) return; 
  if(!message.member) message.member = await message.guild.fetchMember(message); 
  const args = message.content.slice(prefix.length).trim().split(/ +/g); 
  const cmd = args.shift().toLowerCase(); 
  if(cmd.length == 0 ) return; 
  const command = bot.commands.get(cmd) 
  if(!command) command = bot.commands.get(bot.aliases.get(cmd)); 
  if(command){
    command.run(bot,message,args)
  }

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

  bot.login(process.env.token);