import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { createEmbed } from "./component";

export const sleep = (second: number, callback: any) => {
    
    const promise = new Promise(resolve => {
        setTimeout(() => { resolve(callback); }, second * 1000);
    })
    return promise;
}

export const countDown = async (second: number = 0, message: string, channel: TextChannel, client: Client | null = null, idPlayer: string | null = null) =>{
    const embed = createEmbed(message, `${message}: ${second}s`);
    let pmMsg: any;
    if (idPlayer) {
        pmMsg = await client.users.fetch(idPlayer).then(async (user: any) => user.send({ embeds: [embed] }))
    }
    const msg = channel ? await channel.send({ embeds: [embed] }) : "";
    return new Promise(resolve => {
        let interval = setInterval(async () => {
            const newEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(message)
                .setDescription(`${message}: ${second--}s`);
            if (msg) {
                await msg.edit({ embeds: [newEmbed] });
            }
            if (pmMsg) { await pmMsg.edit({ embeds: [newEmbed] }) };
            if (second < 0) {
                resolve(clearInterval(interval));
                const endEmbed = createEmbed("Time up !!!", "Time up !!!", null, null, 0xD83C3E);
                if (msg) {
                    await msg.edit({ embeds: [endEmbed] });
                }
                if (pmMsg) { await pmMsg.edit({ embeds: [newEmbed] }) };
            }
        }, 1000);
    })
}
