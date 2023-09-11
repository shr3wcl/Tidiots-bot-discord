import { CacheType, Client, GuildMember, Interaction, EmbedBuilder } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import ytdl = require('ytdl-core');
import MusicObject from "../../../music/MusicObject";
import listChannel from "../../../music/ListMusic";


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
                        await interaction.reply("Không tìm thấy kênh đàm thoại để phát âm thanh");
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
                case "list":
                    let memberList = interaction.member as GuildMember;
                    
                    if ( memberList.voice.channel?.id ) {
                        const voiceChannelId = memberList.voice.channel.id;
                        const channel = listChannel.find(each => each.getId() == voiceChannelId);
                        if (channel) {
                            await channel.list(interaction);
                        } else {
                            await interaction.reply("Bạn không thể dùng tính năng này khi đang ở kênh thoại khác với bot");
                        }
                    } else {
                        await interaction.reply("Bạn không ở trong kênh đàm thoại để có thể sử dụng lệnh này");
                    }

                    break;
                case "next":
                    let memberNext = interaction.member as GuildMember;
                    
                    if ( memberNext.voice.channel?.id ) {
                        const voiceChannelId = memberNext.voice.channel.id;
                        const channel = listChannel.find(each => each.getId() == voiceChannelId);
                        if (channel) {
                            await channel.next(interaction);
                        } else {
                            await interaction.reply("Bạn không thể chọn phát danh sách nhạc tiếp theo khi ở kênh đàm thoại khác");
                        }
                    } else {
                        await interaction.reply("Bạn không ở trong kênh đàm thoại để có thể sử dụng lệnh này");
                    }
                    break;
                case "pause":
                    let memberPause = interaction.member as GuildMember;
                    
                    if ( memberPause.voice.channel?.id ) {
                        const voiceChannelId = memberPause.voice.channel.id;
                        const channel = listChannel.find(each => each.getId() == voiceChannelId);
                        if (channel) {
                            await channel.pause(interaction);
                        } else {
                            await interaction.reply("Bạn không thể tạm dừng một bot phát nhạc ở kênh đàm thoại khác");
                        }
                    } else {
                        await interaction.reply("Bạn không ở trong kênh đàm thoại để có thể sử dụng lệnh này");
                    }
                    break;
                case "unpause":
                    let memberUnPause = interaction.member as GuildMember;
                    
                    if ( memberUnPause.voice.channel?.id ) {
                        const voiceChannelId = memberUnPause.voice.channel.id;
                        const channel = listChannel.find(each => each.getId() == voiceChannelId);
                        if (channel) {
                            await channel.unpause(interaction);
                        } else {
                            await interaction.reply("Bạn không thể hủy bỏ tạm dừng bot phát nhạc ở một kênh đàm thoại khác");
                        }
                    } else {
                        await interaction.reply("Bạn không ở trong kênh đàm thoại để có thể sử dụng lệnh này");
                    }
                    break;
                case "clear":
                    let memberClear = interaction.member as GuildMember;
                    
                    if ( memberClear.voice.channel?.id ) {
                        const voiceChannelId = memberClear.voice.channel.id;
                        const channel = listChannel.find(each => each.getId() == voiceChannelId);
                        if (channel) {
                            await channel.clear(interaction);
                        } else {
                            await interaction.reply("Bạn không thể làm sạch danh sách phát của bot phát nhạc ở một kênh đàm thoại khác");
                        }
                    } else {
                        await interaction.reply("Bạn không ở trong kênh đàm thoại để có thể sử dụng lệnh này");
                    }
                    break;
            }
        })
    }
}

export default musicCommands;
