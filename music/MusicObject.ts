import { CacheType, Interaction, GuildMember, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, AudioPlayer, VoiceConnection } from "@discordjs/voice";
import ytdl = require('ytdl-core');
import { sleep } from "../feature/function";
import { createEmbed } from "../feature/component";

type Music = {
    url: string;
    title: string;
    author: string;
    thumbnail: string
}

class MusicObject  {
    private idChannel: string;
    private listMusic: Music[] =  [];
    private guildId: string;
    private interaction: ChatInputCommandInteraction<CacheType>;
    private connection: VoiceConnection;
    private player: AudioPlayer;
    private timeToLive: number = 0;
    private currentUrl: string;

    constructor(idCh: string, url: string, idG: string, inter: ChatInputCommandInteraction<CacheType>) {
        this.idChannel = idCh;
        this.currentUrl = url;
        this.guildId = idG;
        this.interaction = inter;
    }

    getId(): string{
        return this.idChannel;
    }

    async addUrl(url: string, interact: ChatInputCommandInteraction<CacheType>) {
        let embed: EmbedBuilder;
        try{
            const { videoDetails } = await ytdl.getInfo(url);
            this.listMusic.unshift({
                url: url,
                title: videoDetails.title,
                author: videoDetails.author.name,
                thumbnail: videoDetails.thumbnails[0].url
            });
            embed = createEmbed(`**Đã thêm** ${videoDetails.title}`, `Đã thêm **${videoDetails.title}** của **${videoDetails.author.name}** vào danh sách phát của kênh này`, videoDetails.thumbnails[0].url, videoDetails.video_url);
        }catch(err){
            embed = createEmbed("Không thể tìm thấy đường dẫn", "Không thể tìm thấy đường dẫn, hoặc đường dẫn không hợp lệ, vui lòng thử lại");
        }

        try{
            await interact.reply({
                embeds: [embed]
            });
        }catch(err){
            await interact.channel.send({
                embeds: [embed]
            });
        }
        this.timeToLive = -100;
    }

    async quit(interact: ChatInputCommandInteraction<CacheType>){
        this.connection.destroy();
        const embed = createEmbed("Bot đã rời khỏi phòng!", `Tạm biệt, hẹn gặp lại.`);
        await interact.reply({
            embeds: [embed]
        })
    }
    
    async list(interact: ChatInputCommandInteraction<CacheType>) {
        let urlTable = "";
        let embed: EmbedBuilder;
        if (this.listMusic.length !== 0) {
            this.listMusic.forEach(async (music: Music, index) => {
                urlTable += `${index+1}. [**${music.title}**](${music.url})` + `\n[${music.author}](${music.url})` + "\n";
            });
            embed = createEmbed("Danh sách phát", `${urlTable}`);
        } else {
            embed = createEmbed("Danh sách phát trống", "Hiện trong danh sách không có bài hát nào");
        }
        await interact.reply({
            embeds: [embed]
        });
    }

    async next(interact: ChatInputCommandInteraction<CacheType> = this.interaction) {
        this.player.stop();
        const embed = createEmbed("Đang phát danh sách phát tiếp theo", "Đang phát danh sách phát tiếp theo");
        try{
            await interact.reply({
                embeds: [embed]
            })
        }catch(err){
            await interact.channel.send({
                embeds: [embed]
            });
        }            
    }

    async pause(interact: ChatInputCommandInteraction<CacheType>) {
        this.player.pause();
        const embed = createEmbed("Đã tạm dừng danh sách phát", `Tạm dừng danh sách phát`);
        await interact.reply({
            embeds: [embed]
        })
    }

    async unpause(interact: ChatInputCommandInteraction<CacheType>) {
        this.player.unpause();
        const embed = createEmbed("Tiếp tục phát danh sách", `Tiếp tục phát danh sách`);
        await interact.reply({
            embeds: [embed]
        })
    }

    async clear(interact: ChatInputCommandInteraction<CacheType>) {
        this.listMusic = [];
        this.next();
        const embed = createEmbed("Đã làm trống danh sách phát", "Danh sách phát đã được làm trống");
        await interact.reply({embeds: [embed]});
    }

    async checkTTL(){
        if (this.listMusic.length === 0){
            this.timeToLive = 1;
            const embed = createEmbed("Danh sách phát trống trơn!", `Danh sách phát đã hết, hãy thêm vào để tiếp tục...`);
            await this.interaction.channel.send({
                embeds: [embed]
            });
            const timeLive = setInterval(async () => {
                if (this.timeToLive <= 0){
                    clearInterval(timeLive);
                    this.play(this.listMusic[0]);
                }
                if (this.timeToLive >= 60){
                    const embed = createEmbed("Tạm biệt!", "Do không hoạt động trong thời gian dài nên bot đã rời khỏi phòng, bạn vẫn có thể gọi lại bot ...");
                    await this.interaction.channel.send({
                        embeds: [embed]
                    });
                    clearInterval(timeLive);
                    this.connection.disconnect();
                }
                this.timeToLive += 1;
            }, 1000);
        } else{
            this.play(this.listMusic[0]);
        }
    }

    async play(music: Music) {     
        try{
            const stream = ytdl(music.url, { filter: 'audioonly', highWaterMark: 1 << 25, quality: 'highestaudio' });
            const resource = createAudioResource(stream, { inlineVolume: true });
            this.player.play(resource);
            this.connection.subscribe(this.player);

            this.player.on("error", (error) => {
                this.next();
            })

            this.player.on("stateChange", async (oldState, newState) => {
                if (newState.status === "idle"){
                    this.listMusic.pop();
                    await this.checkTTL();
                }
            })
        }catch(err){
            const embed = createEmbed("Không thể phát", "Đường dẫn có một số vấn đề nên không thể phát bài hát hiện tại, vui lòng thử lại");
            await this.interaction.channel.send({embeds:[embed]});
            this.listMusic.pop();
            await this.checkTTL();
        }
    }



    async start() {
        this.player = createAudioPlayer();
        try {
            this.connection = joinVoiceChannel({
                channelId: this.idChannel,
                guildId: this.guildId,
                adapterCreator: this.interaction.guild.voiceAdapterCreator,
            });
            
        } catch (error) {
            await this.interaction.channel.send("Không thể kết nối đến kênh thoại"); 
        }
        const embed = createEmbed("Xin chào", "Vui lòng đợi trong giây lát, bot sẽ phục vụ liền ^^");
        await this.interaction.reply({
            embeds: [embed]
        })
        await this.addUrl(this.currentUrl, this.interaction);  
        this.play(this.listMusic[0]);
    }
}

export default MusicObject;
