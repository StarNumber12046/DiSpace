import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's ping")
    ,
    execute: async interaction => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name: "Space Mission"})
                .setDescription(`🏓 Pong!  \n 📡 We ping to Houston ${interaction.client.ws.ping}ms`)
                .setColor(getThemeColor("text"))
            ]
        })
    },
    cooldown: 10
}

export default command