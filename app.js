const { Client, GatewayIntentBits, Partials, AttachmentBuilder } = require('discord.js');
const { token } = require('./config.json');
const Canvas = require('@napi-rs/canvas');

const client = new Client({ intents: [ GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel],
});

client.once('ready', () => {
	console.log('Bot is Readyyyyyyyy!');
});

client.on('messageCreate', async (msg) => {
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
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'help') {
		await interaction.reply('$hello: chào lại người gọi đến bot\n$ping: hiển thị ping của kênh mà bot được gọi.\n$user: hiển thị thông tin của người dùng gọi nó\n$server: hiển thị thông tin server của bot\n');
	}
	else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	}
	else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});


client.login(token);