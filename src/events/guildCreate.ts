import { TextChannel, EmbedBuilder, Guild } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";

const event : BotEvent = {
    name: "guildCreate",
    once: true,
    execute: async (guild : Guild) => {
        console.log(
            color("text", `💪 New guild joined: ${color("variable", guild.name)}`),
        )
        const owner = await guild.fetchOwner()
        const embed = new EmbedBuilder()
            .setTitle('New guild joined!')
            .setDescription('I started a mission in ' + guild.name)
            .setAuthor({name:owner.displayName, iconURL: owner.displayAvatarURL.toString()})
        const staffChannel = await guild.client.channels.fetch(process.env.STAFF_CHANNEL_ID as string) as TextChannel
        try {
            await staffChannel.send({embeds:[embed]})
        } catch (error) {
            await staffChannel.send("I joined " + guild.name)
        }
    }

}

export default event;