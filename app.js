// const { Client, GatewayIntentBits, Partials, AttachmentBuilder, VoiceStateManager, GuildChannel, GatewayVersion, GuildMemberManager, GuildMember } = require('discord.js');
const { token } = require('./config.json');
const Canvas = require('@napi-rs/canvas');
const { VoiceConnectionStatus } = require('@discordjs/voice');
const normalCommand = require('./commands/normalCommands');
const bot = require('./commands/bot');
const slashCommands = require('./commands/slashCommands');

bot.once('ready', () => {
	console.log('Bot is Readyyyyyyyy!');
});

normalCommand.normalCom(bot);
slashCommands.slashCommand(bot);

bot.login(token);