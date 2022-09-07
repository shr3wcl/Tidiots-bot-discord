const splashCommands = {
    slashCommand: (client) => {
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
            else if (commandName === 'exit') {
                await interaction.guild.members.kick(`${interaction.user.id}`)
                    .then(kickInfo => console.log(`Kicked ${kickInfo.user?.tag ?? kickInfo.tag ?? kickInfo}`))
                    .catch(console.error);
            }
        });
    }
}

module.exports = splashCommands;