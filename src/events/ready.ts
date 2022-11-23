import { TextChannel, Client } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: async (client: Client) => {
    console.log(
      color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`)
    );
    console.log(
      color(
        "text",
        `I am in ${
          client.guilds.cache.size
        } guilds (cached)`
      )
    );

    const staffChannel = (await client.channels.fetch(
      process.env.STAFF_CHANNEL_ID as string
    )) as TextChannel;
    if (typeof staffChannel === "object") {
      await staffChannel.send(
        "Logged in succesfully! Mission is about to start..."
      );
    }
  },
};

export default event;
