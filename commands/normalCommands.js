const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');


const normalCommands = {
    normalCom: (client) => {
        client.on('messageCreate', async (msg) => {
            // const user = await client.users.fetch(msg.author.id);
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
    }
}

module.exports = normalCommands;