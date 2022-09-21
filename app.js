const { token } = require('./config.json');
const normalCommand = require('./commands/normalCommands');
const bot = require('./commands/bot');
const slashCommands = require('./commands/slashCommands');

bot.once('ready', () => {
	console.log('Bot is Readyyyyyyyy!');
	bot.channels.cache.get('940516974180589580').send({ content: "I'm coming back..." });
});

normalCommand.normalCom(bot);
slashCommands.slashCommand(bot);

bot.login(token);