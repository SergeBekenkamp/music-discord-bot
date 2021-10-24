import { config } from 'dotenv';
import * as Discord from 'discord.js';
import {Intents} from "discord.js";
import {registerCommands} from "./registerCommands";
import {createCommandHandler} from "./commands/createCommandHandler";

config();

const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());

let discordClient: Discord.Client | undefined = undefined;
getDiscordClient();

export function getDiscordClient()
{
    if (discordClient) return discordClient;

    discordClient = new Discord.Client({
        intents: [
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_TYPING,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_PRESENCES
        ],
        partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]
    });


    discordClient.once('ready', async () =>
    {
        console.log(`Logged in as ${discordClient!.user?.tag}!`);

        const guilds = await discordClient!.guilds.fetch({limit: 10});

        guilds.forEach(guild =>
        {
            console.log('registering commands for server ', guild?.id)
            registerCommands(process.env.CLIENT_ID!, guild!.id, process.env.CLIENT_TOKEN!);
        })

        discordClient!.on('interactionCreate', await createCommandHandler());
    });

    discordClient.login(process.env.CLIENT_TOKEN).then((evt) => console.log('test', evt)); //login bot using token

    return discordClient;
}

