import { Client, GatewayIntentBits, Collection } from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } =
  GatewayIntentBits;
import { Command, SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";

const client = new Client({
  intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
  presence: {
    status: "online",
    activities: [{ name: "space", type: 5 }],
    afk: true,
  },
  ws: { properties: { browser:"Discord iOS" }}
});
config();

client.slashCommands = new Collection<string, SlashCommand>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
  require(`${handlersDir}/${handler}`)(client);
});

client.login(process.env.TOKEN);
