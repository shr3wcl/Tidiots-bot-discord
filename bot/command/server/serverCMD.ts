import { CacheType, Client, Interaction } from "discord.js"

const serverCommand = {
    command: (bot: Client) => {
        bot.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
            if (!interaction.isChatInputCommand()) return;
            
            const { commandName } = interaction;

            switch (commandName) {
                case "ping":
                    await interaction.reply("Pong !!!");
                    break;
                case "":
                    break;
            }
        })
    }
}

export default serverCommand;