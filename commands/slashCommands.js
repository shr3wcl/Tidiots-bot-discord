const { PermissionFlagsBits } = require('discord.js');
const moment = require('moment');


const splashCommands = {
    slashCommand: (client) => {
        client.on('interactionCreate', async interaction => {

            const checkAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
            const usernameAndTag = interaction.user.tag;
            const mention = interaction.user;
            const idUser = interaction.user.id;
            const dateCreatedAtFormated = moment(interaction.user.createdAt).format("ll");


            if (!interaction.isChatInputCommand()) return;

            const { commandName } = interaction;

            if (commandName === 'help') {
                await interaction.reply('$hello: chào lại người gọi đến bot\n$ping: hiển thị ping của kênh mà bot được gọi.\n$user: hiển thị thông tin của người dùng gọi nó\n$server: hiển thị thông tin server của bot\n$exit: Out khỏi server hiện tại' +
                    '\n$lich <name> <dateStart> <dateEnd(OPTIONAL)> <description>: lên lịch ở kênh voice');
            }
            else if (commandName === 'server') {
                await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
            }
            else if (commandName === 'user') {
                const imageURL = interaction.user.avatarURL();
                await interaction.reply({
                    content: `Your name: ${usernameAndTag}\n Admin: ${checkAdmin ? "True" : "False"} \nMention: ${mention}\nYour id: ${idUser}\n Created at: ${dateCreatedAtFormated}\nYour avatar:`, files: [imageURL]
                });
            }
            else if (commandName === 'exit') {
                await interaction.guild.members.kick(`${interaction.user.id}`)
                    .then(kickInfo => console.log(`Kicked ${kickInfo.user?.tag ?? kickInfo.tag ?? kickInfo}`))
                    .catch(console.error);
            }
        });
    }
}

module.exports = splashCommands;