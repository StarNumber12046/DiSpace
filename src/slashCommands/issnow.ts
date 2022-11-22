import {
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

export interface IssPosSchema {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  footprint: number;
  timestamp: number;
  daynum: number;
  solar_lat: number;
  solar_lon: number;
  units: string;
}

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("issnow")
    .setDescription("Where is ISS now?"),
  execute: async (interaction) => {
    const request = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );
    const res: IssPosSchema = await request.json();
    const coords_req = await fetch(
      `https://api.wheretheiss.at/v1/coordinates/${res.latitude},${res.longitude}`
    );
    const coords = await coords_req.json();

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: "DiSpace",
            iconURL: interaction.client.user?.avatarURL()?.toString(),
          })
          .setDescription(
            `ISS is at ${coords["latitude"]}km of latitude and ${coords["longitude"]}km of longitude. Also ${res["altitude"]}km of altitude.\n Wanna know where it is from google maps? Here is [the link](${coords["map_url"]})`
          )
          .setColor(getThemeColor("text")),
      ],
    });
  },
  cooldown: 10,
};

export default command;
