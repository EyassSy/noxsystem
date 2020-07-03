module.exports = {
	name: 'hi',
	description: 'hi',
	execute(message, args) {
		message.channel.send('Hello!');
	},
};