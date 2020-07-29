module.exports = {
    name: "hi",
    description: "",
    usage: "hi?",
    category: "fun",

run: async (bot, message, args) => {
    return message.channel.send("Hello")
    }
}