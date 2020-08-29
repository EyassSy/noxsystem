module.exports = {
    name: "restart",
    category: "owner",
    run: async (bot, message, args) => {
        if (message.author.id !== '519503123656605699') {
            return message.channel.send(`You cannot use this command!`)
        }
        await message.channel.send(`Restarting bot...`)
        process.exit();
    }
}