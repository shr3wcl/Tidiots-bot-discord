import { SlashCommandBuilder, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody, APIApplicationCommandOptionChoice } from 'discord.js';
import { REST } from '@discordjs/rest';
import dotenv from 'dotenv';
import * as roles from "../../wolf-game/roles/role.json";
import colors from 'colors';
dotenv.config();

const listRole: APIApplicationCommandOptionChoice<string>[] = [];
for (const role in roles) {
    const choice: APIApplicationCommandOptionChoice<string> = { name: role, value: role};
    listRole.push(choice);
}
listRole.pop();

const listLangs = [
    { name: "English", value: "en" },
    { name: "Tiếng Việt", value: "vi" },
]

const token = process.env.token ?? "", clientID = process.env.clientID ?? "", guildID = process.env.guildID ?? "";

const rest = new REST({ version: '10' }).setToken(token);


const serverCommands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [
    new SlashCommandBuilder().setName("ping").setDescription("Check bot!"),
    new SlashCommandBuilder().setName("language").setDescription("Change language")
        .addStringOption(option => option.setName("language").setDescription("Change language").addChoices(...listLangs).setRequired(true))
].map(command => command.toJSON());

const wolfCommands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [
    new SlashCommandBuilder().setName("wolfgame").setDescription("Start wolf game")
        .addBooleanOption(option => option.setName('mode').setDescription('Public mode dead man role').setRequired(false)),
    new SlashCommandBuilder().setName("listgame").setDescription("List length game"),
    new SlashCommandBuilder().setName("idgame").setDescription("Get id game of this channel"),
    new SlashCommandBuilder().setName("viewrole").setDescription("View details about the role")
        .addStringOption(option => option.setName("role").addChoices(...listRole).setDescription('Choose role').setRequired(true))
].map(command => command.toJSON());

const musicCommands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [
    new SlashCommandBuilder().setName("play").setDescription("Check bot!")
        .addStringOption(option => option.setName('url').setDescription("Url youtube").setRequired(true)),
    new SlashCommandBuilder().setName("quit").setDescription("Remove bot out of channel!"),
].map(command => command.toJSON());

export const registerSlashCommand = (guildId: string) => {
    rest.put(Routes.applicationGuildCommands(clientID, guildId), { body: serverCommands.concat(wolfCommands).concat(musicCommands) })
        .then(() => console.log(colors.green(`[+] Successfully registered ${serverCommands.length} application commands.`)))
        .catch(error => {
            console.log(colors.yellow("[!] There was a problem trying to register the command"));
            console.log(error);
        });
}
