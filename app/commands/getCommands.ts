import {SlashCommandBuilder} from "@discordjs/builders";
import * as Discord from "discord.js";
import * as Ping from './playCommand/index'

export type Command = {
    commandBuilder: Partial<SlashCommandBuilder>,
    handler: (interaction: Discord.CommandInteraction) => Promise<void>,
    command: string,
}

export async function getCommands(): Promise<Command[]> {
    return [Ping];
}
