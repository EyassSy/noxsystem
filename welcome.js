module.exports = (client) => {
    const channelId = '735947262101815809' // welcome channel
    const targetChannelId = '736111712129908816' // rules and info
  
    client.on('guildMemberAdd', (member) => {
      const message = `Welcome <@${
        member.id
      }> to the server! Please check out ${member.guild.channels.cache
        .get(targetChannelId)
        .toString()}`
  
      const channel = member.guild.channels.cache.get(channelId)
      channel.send(message)
    })
  }