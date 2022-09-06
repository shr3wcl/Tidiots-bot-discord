const { Client, GatewayIntentBits, Partials, AttachmentBuilder, VoiceStateManager, GuildChannel, GatewayVersion, GuildMemberManager, GuildMember } = require('discord.js');
const { token } = require('./config.json');
const Canvas = require('@napi-rs/canvas');
const { } = require('@discordjs/voice');

const client = new Client({
	intents: [GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMembers],
	partials: [Partials.Channel],
});

client.once('ready', () => {
	console.log('Bot is Readyyyyyyyy!');
});

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

client.on('messageCreate', async (msg) => {
	const user = await client.users.fetch(msg.author.id);
	const commandName = msg.content;
	if (commandName.toLowerCase() === '$hello') {
		await msg.reply(`Good morning ${msg.author.username}!`);
	}
	else if (commandName.toLowerCase() === '$ping') {
		await msg.reply(`Ping của kênh "${msg.channel.name}" thuộc máy chủ "${msg.guild.name}": ${client.ws.ping}
		ms`);
	}
	else if (commandName === '$server') {
		await msg.reply(`Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}`);
	}
	else if (commandName === '$user') {
		const canvas = Canvas.createCanvas(500, 500);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.webp`);
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		const attachment = new AttachmentBuilder(await canvas.encode('webp', 'p'), { name: 'avatar.png' });

		msg.reply(`Your name: ${msg.author.username}\nYour id: ${msg.author.id}\nYour avatar:`);
		msg.reply({ files: [attachment] });
	}
	else if (commandName === '$dis') {
		await msg.member.voice.disconnect();
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'help') {
		await interaction.reply('$hello: chào lại người gọi đến bot\n$ping: hiển thị ping của kênh mà bot được gọi.\n$user: hiển thị thông tin của người dùng gọi nó\n$server: hiển thị thông tin server của bot\n$exit: Out khỏi server hiện tại');
	}
	else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	}
	else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
	else if (commandName === 'kick') {
		await interaction.guild.members.kick(`${interaction.user.id}`)
			.then(kickInfo => console.log(`Kicked ${kickInfo.user?.tag ?? kickInfo.tag ?? kickInfo}`))
			.catch(console.error);
	}
});


client.login(token);