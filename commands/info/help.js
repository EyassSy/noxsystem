const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {

    try{

        var text = "**Nox System** \n\n **_Commands_** \n -ping - Shows the bot's ping ";

        message.author.send(text);

        message.reply("Check your dms!");

    } catch (error) {
        message.reply("Oops somthing went worng |: ")
    }

}

module.exports.help = {
    name: "help"
}