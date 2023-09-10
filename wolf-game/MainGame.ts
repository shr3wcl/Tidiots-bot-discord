import { randomBytes } from "crypto";
import { Client, Interaction, CacheType, TextChannel, Events, User, Message } from "discord.js";
import { PlayerObject } from './../interface/interface';
import Wolf from "./roles/Wolf";
import Villager from "./roles/Villager";
import { countDown, sleep } from "../feature/function";
import { createEmbed, initSelectOption } from "../feature/component";
import { roles } from "./roles/role.config";
import Witch from "./roles/Witch";
import Player from "./roles/Player";
import BodyGuard from "./roles/BodyGuard";

export class startGame {
    private idGame: string;
    private idGuild: string | null;
    private idChannel: string;
    private bot: Client;
    private nameAuthor: string;
    private count: number = 1;
    private channel: TextChannel | undefined;
    private listPlayers: Array<any>;
    private state: Boolean = true;
    private modePublic: Boolean = true;
    private listRole = roles;
    private idChoose: String | null;
    constructor(name: string, idG: string | null, idCh: string, b: Client, players: Array<PlayerObject>, mode: Boolean) {
        this.idGame = randomBytes(10).toString("hex");
        this.nameAuthor = name;
        this.bot = b;
        this.idChannel = idCh;
        this.idGuild = idG;
        this.listPlayers = players;
        const channel = this.bot.channels.cache.get(this.idChannel);
        if (channel instanceof TextChannel) {
            this.channel = channel;
        }
        this.modePublic = mode;
    };
    getIdGame() {
        return this.idGame;
    };
    getAuthor() {
        return this.nameAuthor;
    };
    getChannel() {
        return this.channel;
    };
    async findPlayerById(id: string) {
        return await this.listPlayers.find(player => player.getId() === id);
    };
    async initialization() {
        this.listPlayers.sort(() => Math.random() - 0.5);
        this.listPlayers.forEach((el, index) => {
            switch (this.listRole[index]) {
                case "bodyguard":
                    this.listPlayers[index] = new BodyGuard(el.user, el.id);
                    break;
                case "witch":
                    this.listPlayers[index] = new Witch(el.user, el.id);
                    break;
                case "wolf":
                    this.listPlayers[index] = new Wolf(el.user, el.id);
                    break;
                case "village":
                    this.listPlayers[index] = new Villager(el.user, el.id);
                    break;
            }
        })
        this.listPlayers.sort(() => Math.random() - 0.5);
        const wolfList = this.listPlayers.filter(each => each.getRole() === 'wolf'); 
        const listName = wolfList.reduce((arr, cur: PlayerObject) => arr + (arr ? ', ' : '') + cur.user.tag, '');
        if (wolfList) {
            wolfList.forEach(async (wolf: PlayerObject) => await wolf.user.send("List of wolves: " + listName));
        }
        await this.setupClient();
    };
    async setupClient() {
        this.bot.on(Events.MessageCreate, async (message: Message) => {

            const content = message.content.split(' ');
            const prefix = content.shift().trim().toLowerCase();
            console.log(123);

            if (prefix === "$wolfchat") {
                const owner: Player = await this.findPlayerById(message.author.id);
                if (owner.getRole() === "wolf") {
                    const wolfList = this.listPlayers.filter(async (each) => await each.getRole() === 'wolf');
                    if (wolfList) {
                        wolfList.forEach(async (wolf: PlayerObject) => await wolf.user.send(content.join(" ")));
                    }
                } else {
                    await message.reply("You are not wolf");
                }
            }
        });
        this.bot.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (!interaction.isStringSelectMenu()) return;
            const { values, customId, user } = interaction;
            switch (customId) {
                case `protect-guard-${this.idChannel}`:
                    await interaction.reply("Successful selection");
                    this.idChoose = values[0];
                    break;
                case `kill-wolf-${this.idChannel}`:
                    await interaction.reply("Successful selection");
                    const player: Wolf = await this.findPlayerById(user.id);
                    player.kill(values[0]);
                    break;
            }
        });
        
    };
    async findUserByRole(role: string) {
        return await this.listPlayers.find(player => player.getRole() === role);
    }
    getListPlayers() {
        let listName = "";
        this.listPlayers.forEach(each => listName += each.getName());
        return listName;
    }
    checkGameOver() : Boolean{
        return true
    };
    async start() {
        await this.initialization();
        while (this.checkGameOver()) {
            await this.channel.send(this.getListPlayers());
            /**
             * Bodyguard
             */
            let currentPlayer = await this.findUserByRole("bodyguard");
            await this.channel.send({ embeds: [createEmbed("Bodyguard Time", "Bodyguard please go to a private message to choose who to protect tonight")]});
            if (currentPlayer) {
                const listProtected = initSelectOption(this.listPlayers, `protect-guard-${this.idChannel}`, "Choose someone...");
                currentPlayer.user.send({ components: [listProtected], content: "You are Bodyguard, choose who you will protect" });
                await countDown(10, "Thời gian còn lại 1", null, this.bot, currentPlayer.getId());
                currentPlayer.protect(this.idChannel);
            } else {
                await countDown(10, "Thời gian còn lại 2", this.channel);
            }
            
            /**
             * Seer
             */

            /**
             * Wolf
             */
            await this.channel.send({ embeds: [createEmbed("Wolves Time", "Wolves please go to a private message to choose who to kill tonight")] });
            const wolfList = this.listPlayers.filter(async (each) => await each.getRole() === 'wolf');  
            if (wolfList) {
                wolfList.forEach(async (wolf: PlayerObject) => {
                    const listKilled = initSelectOption(this.listPlayers, `kill-wolf-${this.idChannel}`, "Choose someone...");
                    // @ts-ignore
                    await wolf.user.send({ components: [listKilled], content: "You are wolf, choose who you will kill" })
                    await countDown(10, "Time remaining: ", null, this.bot, wolf.id);
                });
            } 
            await countDown(10, "Time remaining: ", this.channel);
        }
    };
    
}
