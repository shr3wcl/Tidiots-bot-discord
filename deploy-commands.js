const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');
const {config} = require("dotenv");
const dotenv = require('dotenv');

dotenv.config();

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('help').setDescription('Replies with help1'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!').addUserOption(option=>
		option.setName('target').setDescription('get user').setRequired(true)),
	new SlashCommandBuilder().setName(`exit`).setDescription('Delete spam @everyone'),
	new SlashCommandBuilder().setName('schedule').setDescription('Set schedule').addStringOption(option=>
		option.setName('name').setDescription('name schedule').setRequired(true)
	),
]
	.map(command => command.toJSON());


const rest = new REST({ version: '10' }).setToken(token);
rest.put(Routes.applicationGuildCommands(process.env.botAppId, process.env.guildId), {files: null, body: commands})
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);