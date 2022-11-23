import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import NodeCache from "node-cache";
import { SlashCommand } from "../types";
import { LaunchSchema } from "./schemas/Launch";
const cache = new NodeCache();

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("spacex")
    .setDescription("get SpaceX launches")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the launch to get")
        .setRequired(false)
        .setAutocomplete(true)
    ),

  execute: async (interaction) => {
    const launch = interaction.options.get("name")?.value || "latest";
    if(launch == "latest") {
      const response = await fetch(`https://api.spacexdata.com/v5/launches/latest`);
      const data: any = await response.json();
      const launchData:LaunchSchema = data
      const embed = new EmbedBuilder()
          .setTitle("About " + launchData.name)
          .setDescription(launchData.details||"No description available." + "\n\n Other images are available:\n" + launchData.links.flickr.original.slice(1).join("\n"))
          .addFields([
            { name: "Launch date", value: `<t:${launchData.date_unix}>`, inline:true },
            { name: "Succes?", value: launchData.success.toString().charAt(0).toUpperCase() + launchData.success.toString().slice(1), inline:true },
          ]
          )
          .setThumbnail(launchData.links.patch.large||"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png")
          .setImage(launchData.links.flickr.original[0]);
      interaction.reply({embeds:[embed]})
    }
    else {

      // console.log(launch)
      const response = await fetch(`https://api.spacexdata.com/v5/launches/`);
      const data: any = await response.json();
      const data_ok: LaunchSchema[] = data.filter(
        (doc: any, index: any, arr: any) => {
          return doc.name == launch;
        }
        );
        const launchData = data_ok[0];
        if (!launchData) {
          return interaction.reply(
            "Launch not found, maybe it will begin in the future"
            );
          }
          const embed = new EmbedBuilder()
          .setTitle("About " + launchData.name)
          .setDescription(launchData.details||"No description available." + "\n\n Other images are available:\n" + launchData.links.flickr.original.slice(1).join("\n"))
          .addFields([
            { name: "Launch date", value: `<t:${launchData.date_unix}>`, inline:true },
            { name: "Succes?", value: launchData.success.toString().charAt(0).toUpperCase() + launchData.success.toString().slice(1), inline:true },
          ]
          )
          .setThumbnail(launchData.links.patch.large||"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png")
          .setImage(launchData.links.flickr.original[0]);
          interaction.reply({ embeds: [embed] });
        }
          
         
    
  },
  autocomplete: async (interaction) => {
    const focusedValue = interaction.options.getFocused();
    if (cache.get("launches")) {
      const launches: string[] = cache.get("launches") as string[];
      const filtered = launches.filter((choice) =>
        choice.startsWith(focusedValue)
      );

      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    } else {
      const response = await fetch("https://api.spacexdata.com/v5/launches");
      const res: LaunchSchema[] = await response.json();
      let launches = res.map((launch) => launch.name).slice(0, 24);
      cache.set("launches", launches, 3600);
      const filtered = launches.filter((choice) =>
        choice.startsWith(focusedValue)
      );
      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }
  },
  cooldown: 10, //cooldown
};

export default command;
