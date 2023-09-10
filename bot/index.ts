import { wolfCommand } from "./command/wolf/index";
import { client } from "./config/config";
import { registerSlashCommand } from "./command/deployCommand";
import { connectDB } from "../connect-db";
import serverCommand from "./command/server/serverCMD";
import musicCommands from "./command/music/musicCmd";
import colors from 'colors';

require('dotenv').config();

connectDB();

client.on("guildCreate", guild => {
    const idGuild = guild.id;
    registerSlashCommand(idGuild);
    console.log(colors.green(`[+] Bot joined guild: ${guild.name}, with ID: ${idGuild}`));
})

client.once('ready', () => {
    client.guilds.cache.forEach(guild => {
        registerSlashCommand(guild.id)
    });
    console.log(colors.green('[+] Bot is Ready!'));
});

wolfCommand.command(client);
serverCommand.command(client);
musicCommands.command(client);

client.login(process.env.token).then((data: string) => console.log(colors.green("[+] Server is Connected!"))).catch((err: string) => {console.log(colors.red("[-] Cannot connect to server"));console.log(err);});
