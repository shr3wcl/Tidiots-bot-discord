const { Client, GatewayIntentBits, Partials, AttachmentBuilder, VoiceStateManager, GuildChannel, GatewayVersion, GuildMemberManager, GuildMember } = require('discord.js');
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


// client.on('voiceStateUpdate', (oldMember, newMember) => {
// 	let newUserChannel = newMember.voiceChannel;
// 	let oldUserChannel = oldMember.voiceChannel;
// 	var channel = client.channels.resolveId("721564631642144861");


//   	if(oldUserChannel === undefined && newUserChannel !== 615306755420717143) {
//     channel.send(newMember + ' has been verified.');
//     let role = newMember.guild.roles.find(role => role.name === "Verified");
//     newMember.addRole(role);
//     let verifyEmbed = new Discord.RichEmbed()
//     .setAuthor("Verificaiton")
//     .setDescription("You have been verified")
//     .setFooter(newMember.guild.name)
//     .setColor("#98AFC7")
//     newMember.sendMessage(verifyEmbed);
//     newMember.disconnect();
//   }
// });

bot.login(token);