import { CacheType, Interaction, GuildMember, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import ytdl = require('ytdl-core');
import { sleep } from "../feature/function";
import { createEmbed } from "../feature/component";


class MusicObject  {
    private idChannel: string;
    private listUrl: Array<string> =  [];
    private guildId: string;
    private interaction: ChatInputCommandInteraction<CacheType>;
    private connection: any;

    constructor(idCh: string, url: string, idG: string, inter: ChatInputCommandInteraction<CacheType>) {
        this.idChannel = idCh;
        this.listUrl.push(url);
        this.guildId = idG;
        this.interaction = inter;
    }

    getId(): string{
        return this.idChannel;
    }

    async addUrl(url: string, interact: ChatInputCommandInteraction<CacheType>) {
        this.listUrl.unshift(url);
        const { videoDetails } = await ytdl.getInfo(url);
        const embed = createEmbed(videoDetails.title, `Đã thêm **${videoDetails.title}** của **${videoDetails.author.name}** vào danh sách phát của kênh này`, videoDetails.thumbnails[0].url, videoDetails.video_url)
        await interact.reply({
            embeds: [embed]
        });
    }

    async quit(interact: ChatInputCommandInteraction<CacheType>){
        this.connection.destroy();
        const embed = createEmbed("Bot đã rời khỏi phòng!", `Tạm biệt, hẹn gặp lại.`);
        await interact.reply({
            embeds: [embed]
        })
    }
    
    // Develop features: list, next, stop, continue, remove
    async list(interact: ChatInputCommandInteraction<CacheType>) {
        const urlTable = "";
        this.listUrl.forEach(async (url: string) => {
             const { videoDetails } = await ytdl.getInfo(url);

        });
    }

    async next() {

    }

    async stop() {

    }

    async continue() {

    }

    async remove() {

    }

    async start() {
        try {
            this.connection = joinVoiceChannel({
                channelId: this.idChannel,
                guildId: this.guildId,
                adapterCreator: this.interaction.guild.voiceAdapterCreator,
            });
        } catch (error) {
            await this.interaction.channel.send("Không thể kết nối đến kênh thoại"); 
        }
        while (true) {
            if(this.listUrl.length == 0){
                break;
            }
            try {
                const url = this.listUrl.pop();

                const stream = ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25, quality: 'highestaudio' });
                const { videoDetails } = await ytdl.getInfo(url);
                const resource = createAudioResource(stream, { inlineVolume: true });
                const player = createAudioPlayer();
                player.play(resource);
                this.connection.subscribe(player);

                player.on(AudioPlayerStatus.Idle, () => {
                    // connection.destroy();
                });
    
                const embed = createEmbed(videoDetails.title, `Đang phát **${videoDetails.title}** của **${videoDetails.author.name}**`, videoDetails.thumbnails[0].url, videoDetails.video_url);

                try {
                    await this.interaction.reply({
                        embeds: [embed]
                    });
                } catch (error) {
                    await this.interaction.channel.send({
                        embeds: [embed]
                    })
                } 
                await sleep(parseInt(videoDetails.lengthSeconds) + 5, "Oke");
            } catch (error) {
                console.log(error);
                break;
            }
        }
        const embed = createEmbed("Danh sách phát trống trơn!", `Danh sách phát đã hết, hãy thêm vào để tiếp tục...`);

        await this.interaction.channel.send({
            embeds: [embed]
        });
        this.connection.destroy();
    }
}

export default MusicObject;
