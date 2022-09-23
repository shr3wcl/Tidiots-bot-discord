const { PermissionFlagsBits } = require('discord.js');
const moment = require('moment');


const splashCommands = {
    slashCommand: (client) => {
        client.on('interactionCreate', async interaction => {

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
                const user = interaction.options.getUser('target');
                const checkAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
                const usernameAndTag = user?.tag;
                const mention = user;
                const idUser = user?.id;
                const dateCreatedAtFormated = moment(user?.createdAt).format("ll");
                const imageURL = user.avatarURL();
                await interaction.reply({
                    content: `Name: ${usernameAndTag}\nAdmin: ${checkAdmin ? "True" : "False"} \nMention: ${mention}\nId: ${idUser}\nCreated at: ${dateCreatedAtFormated}\nAvatar:`, files: [imageURL]
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