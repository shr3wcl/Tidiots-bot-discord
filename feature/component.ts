import { ActionRowBuilder, ColorResolvable, Component, EmbedBuilder, StringSelectMenuBuilder, MessageActionRowComponent } from "discord.js";

export const createEmbed = (title: string, description: string, thumbnail: string | null = null, url: string | null = null, color: ColorResolvable | null = 0x0099FF) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description).setThumbnail(thumbnail).setURL(url);
}

export const initSelectOption = (list: Array<any>, id: string, placeholder: string) => {
    const options: any[] = [];
    list.forEach(each => {
        if (each.getState()) {
            options.push({ label: each.getName(), value: each.getId() })
        }
    })
    const component = new ActionRowBuilder()
        .addComponents(new StringSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder(placeholder)
            .addOptions(
                options
            ),
    );
    return component;
}
