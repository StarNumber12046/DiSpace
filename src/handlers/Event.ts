import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";
import { BotEvent } from "../types";

module.exports = async (client: Client) => {
    let eventsDir = join(__dirname, "../events")

    readdirSync(eventsDir).forEach(async (file) => {
        if (!file.endsWith(".js")) return;
        let event: BotEvent = require(`${eventsDir}/${file}`).default
        console.log(color("text", `🌠 Loading event ${color("variable", event.name)}`))
        
        event.once ?
            client.once(event.name, async (...args) => await event.execute(...args))
            :
            client.on(event.name, async (...args) => await event.execute(...args))
        console.log(color("text", `🌠 Successfully loaded event ${color("variable", event.name)}`))
    })
}
