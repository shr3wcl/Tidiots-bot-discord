import { CacheType, Client, GuildMember, Interaction, EmbedBuilder } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import ytdl = require('ytdl-core');
import MusicObject from "../../../music/MusicObject";

const listChannel: Array<MusicObject> = [];

const musicCommands = {
    command: (bot: Client) => {
        bot.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
            if (!interaction.isChatInputCommand()) return;

            const { commandName, options } = interaction;

            switch (commandName) {
                case "play":
                    let member = interaction.member as GuildMember;
                    if (member.voice.channel?.id) {
                        const voiceChannelId = member.voice.channel.id;
                        const channel = listChannel.find(each => each.getId() == voiceChannelId);
                        if (channel) {
                            await channel.addUrl(options.getString('url'), interaction);
                        } else {
                            const music = new MusicObject(voiceChannelId, options.getString('url'), interaction.guild.id, interaction);
                            listChannel.push(music);
                            await music.start();
                        }
                    } else {
                        await interaction.reply("Không tìm thấy kênh voice để phát âm thanh");
                    }
                    
                    break;
                case "quit":
                    let person = interaction.member as GuildMember;

                    if ( person?.voice?.channel?.id ) {
                        const voiceChannelId = person.voice.channel.id;
                        const channel = listChannel.find(each => each.getId() == voiceChannelId);
                        if (channel){
                            await channel.quit(interaction);
                        } else {
                            await interaction.reply("Bạn không thể kick một bot đang ở một kênh đàm thoại khác");
                        }
                    } else {
                        await interaction.reply("Bạn đang không ở kênh đàm thoại để có thể sử dụng lệnh này");
                    }
                    break;
            }
        })
    }
}

export default musicCommands;
