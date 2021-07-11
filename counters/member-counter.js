module.exports = async (bot) =>{
    const guild = bot.guilds.cache.get('613504635956887562');
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('863746493239132190');
        channel.setName(`Total Members: ${memberCount.toLocaleString()}`);
        console.log('Updating Member Count');
    }, 600000);
}