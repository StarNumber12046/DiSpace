import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest"
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";
import { Command, SlashCommand } from "../types";

module.exports = (client : Client) => {
    const slashCommands : SlashCommandBuilder[] = []
   
    let slashCommandsDir = join(__dirname,"../slashCommands")

    readdirSync(slashCommandsDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let command : SlashCommand = require(`${slashCommandsDir}/${file}`).default
        try {
            slashCommands.push(command.command)
            client.slashCommands.set(command.command.name, command)
        } catch (error) {
            console.error("Unable to load command from" + file) 
        }
    })

    const rest = new REST({version: "10"}).setToken(process.env.TOKEN);

    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: slashCommands.map(command => command.toJSON())
    })
    .then((data : any) => {
        console.log(color("text", `🔥 Successfully loaded ${color("variable", data.length)} slash command(s)`))
    }).catch(e => {
        console.log(e)
    })
}