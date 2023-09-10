import { Client, Interaction, CacheType, EmbedBuilder, Events } from 'discord.js';
import { startGame } from './../../../wolf-game/MainGame';
import { User } from 'discord.js';
import { PlayerObject, ListGameObject, WolfObject } from './../../../interface/interface';
import { saveNewGame } from "../../../Controllers/Game";
import * as listRoles from "../../../wolf-game/roles/role.json";
import { createEmbed } from '../../../feature/component';

const listGame: Array<ListGameObject> = [];
let lang = "en";

export const wolfCommand: WolfObject =  {    
    command(bot) {
        bot.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
            if (!interaction.isChatInputCommand()) return;

            const { commandName, user, options } = interaction;

            switch (commandName) {
                case "wolfgame":
                    if (!listGame.find(each => each.idChannel == interaction.channelId)) {
                        const embedVote = createEmbed("React this post to join this game", "React this post to join this game");
                        const message = await interaction.reply({
                            embeds: [embedVote],
                            fetchReply: true
                        });
                        await message.react('🔥');
                        
                        message.awaitReactions({ max: 20, time: 5000 })
                            .then(async (collected: any) => {
                                const reaction = collected.first();
                                const players: Array<PlayerObject> = [];
                                await reaction.users.fetch().then((users: any) => {
                                    users.forEach((user: User) => {
                                        if (!user.bot) {
                                            players.push({ user: user, id: user.id });
                                        }
                                    })
                                })
                                if (players.length) {
                                    const newGame = new startGame(user.tag, interaction.guildId, interaction.channelId, bot, players, options.getBoolean("mode") ?? true);
                                    const embed = createEmbed("New game", `${user.tag} started a new game with ID: ${newGame.getIdGame()}\nThis game has ${players.length} players!`);
                                    listGame.push({ idChannel: interaction.channelId, idGame: newGame.getIdGame() });
                                    // saveNewGame(newGame.getIdGame(), user.id, user.tag, interaction.guildId, interaction.channelId, false, players.length);
                                    await interaction.channel?.send({ embeds: [embed] });
                                    await newGame.start();
                                } else {
                                    interaction.channel?.send(`Not enough players!`);
                                }
                            })
                            .catch((err: string) => {
                                console.log(err);
                                interaction.channel?.send(`Not enough players!`);
                            });
                    } else {
                        await interaction.reply("This channel has a game already!");
                    }
                    break;
                case "listgame":
                    await interaction.reply(listGame.length.toString());
                    break;
                case "idgame":
                    const idGame = listGame.find(each => each.idChannel == interaction.channelId);
                    if (idGame) {
                        await interaction.reply("This is a ID: " + idGame.idGame);
                    } else {
                        await interaction.reply("This channel doesn't have any games!");
                    }
                    break;
                case "viewrole":
                    const roleSelect = options.getString('role');
                    const nameRole = listRoles[roleSelect][lang]['name'];
                    const des = listRoles[roleSelect][lang]['description'];
                    const faction = listRoles[roleSelect][lang]['faction'];
                    const embed = createEmbed(nameRole, `**Description**: ${des}\n**Faction**: ${faction}`, null, listRoles[roleSelect]['imgUrl']);
                    await interaction.reply({ embeds: [embed] });
                    break;
                case "language":
                    lang = options.getString("language");
                    interaction.reply("Language changed");
                    break;
            }
        });
    },
}