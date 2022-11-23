import {
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";

import { SlashCommand } from "../types";


const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Join the support server"),
  execute: async (interaction) => {
    interaction.reply(
      {content:`Join the support server @ ${process.env.SUPPORT_URL}`, ephemeral:true}
  )},
  cooldown: 0, //cooldown
};

export default command;
