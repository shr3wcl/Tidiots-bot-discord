const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');


const normalCommands = {
    normalCom: (client) => {
        client.on('messageCreate', async (msg) => {
            console.log(msg.author.avatarURL());
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
                /*======== Use canvas to draw something ================
                const canvas = Canvas.createCanvas(100, 100);
                const context = canvas.getContext('2d');
                const background = await Canvas.loadImage(imageURL);
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                const attachment = new AttachmentBuilder(await canvas.encode('webp', 'gif'), { name: 'avatar.gif' });
                await msg.channel.send({ content: 'Hello', files: [attachment] });
                const imageURL = 'https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.webp';
                ======== ============================= ================*/
                const imageURL = msg.author.avatarURL();


                await msg.reply({ content: `Your name: ${msg.author.username}\nYour id: ${msg.author.id}\nYour avatar:`, files: [imageURL] });
                // msg.reply({ files: [attachment] });
            }
            else if (commandName === '$dis') {
                await msg.member.voice.disconnect();
            }
        });
    }
}

module.exports = normalCommands;