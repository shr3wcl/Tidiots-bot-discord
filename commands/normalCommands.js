const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder, PermissionsBitField, GuildMemberManager, PermissionFlagsBits, GuildScheduledEvent,
    VoiceChannel, BaseGuildVoiceChannel, SnowflakeUtil
} = require('discord.js');
const moment = require('moment');
const { GuildScheduledEventEntityType } = require("discord-api-types/v8");
const { now } = require("moment");


const normalCommands = {
    normalCom: (client) => {
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
                const checkAdmin = msg.member.permissions.has(PermissionFlagsBits.Administrator);

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
                await msg.reply({
                    content: `\`\`\`Your name: ${msg.author.tag}\n Admin: ${checkAdmin ? "True" : "False"} \nMention:${msg.author}\n`+
                        `Your id: ${msg.author.id}\n Created at: ${moment(msg.author.createdAt).format("ll")}\nYour avatar:`, files: [imageURL],
                    content: `\`\`\``,
                });

            }
            else if (commandName === '$dis') {
                await msg.member.voice.disconnect();
            }
            else if (commandName.split(' ')[0] === '$lich') {
                const guild = msg.guild;
                // const idChannel = msg.channel.id;
                const idChannel = '882088542535290891'; //id voicechat 'code' máy chủ 'Hội gaming NĐC'
                const raw = commandName.split(' ');
                const nameEvent = raw[1];
                let dateInput = raw[2];
                const elementDatehasTime = raw[2].split('/' ?? '-');
                const time = elementDatehasTime[2].split('T');
                const dateFormated = `${time[0]}-${elementDatehasTime[1]}-${elementDatehasTime[0]}T${time[1]}`;
                let dateEnd = commandName.split(' ')[3] ?? null;
                const description = commandName.split(' ')[4] ?? null;
                let dateStart = null;
                const banner = msg.author.avatarURL();
                try {
                    dateStart = Date.parse(dateFormated);
                    dateEnd = Date.parse(dateEnd);
                } catch (err) {
                    msg.reply('1Structure: $lich <name> <dateStart> <dateEnd(OPTIONAL)>');
                }
                try {
                    await guild.scheduledEvents.create({
                        entityType: GuildScheduledEventEntityType.Voice,
                        channel: idChannel,
                        privacyLevel: 2,
                        name: nameEvent,
                        description: description,
                        scheduledStartTime: dateStart,
                        scheduledEndTime: dateEnd,
                        image: banner
                    });
                    msg.reply(`'${nameEvent}' event scheduled\nStart date: ${dateInput.split('T')[1]} - ${dateInput.split('T')[0]}\n` +
                        `Voice channel: ${msg.channel.name}\n${description ? `Description: ${description}` : ''}`);
                } catch (err) {
                    console.log(err);
                    msg.reply('Structure: $lich <name> <dateStart> <dateEnd(OPTIONAL)>');
                }
            }
        });
    }
}

module.exports = normalCommands;