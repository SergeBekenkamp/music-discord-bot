import {SlashCommandBuilder} from "@discordjs/builders";
import * as Discord from 'discord.js';
import {CommandInteractionOption} from 'discord.js';
import {AudioPlayer} from "@discordjs/voice";
import {getOrCreateGuild,} from "../../data/Guild";
import {createYoutubeDlPlayer} from "../../integrations/youtube-dl";
import {createYoutubeDlStreamer} from "../../integrations/youtube-stream";

const command = 'stop'

const commandBuilder = new SlashCommandBuilder()
    .setName(command)
    .setDescription('stop playing music')


const handler = async (interaction: Discord.CommandInteraction) => {

    const guildId = interaction.guild?.id;
    if (!guildId) {
        throw new Error("Cannot find guildId");
    }
    const guild = getOrCreateGuild(guildId);
    guild.stopMusic();
    guild.queue = [];



}

export {
    commandBuilder,
    handler,
    command,
}