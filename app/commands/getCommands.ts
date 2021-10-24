import {SlashCommandBuilder} from "@discordjs/builders";
import * as Discord from "discord.js";
import * as Play from './playCommand/index'
import * as Stop from './stopCommand/index'

export type Command = {
    commandBuilder: Partial<SlashCommandBuilder>,
    handler: (interaction: Discord.CommandInteraction) => Promise<void>,
    command: string,
}

export async function getCommands(): Promise<Command[]> {
    return [Play, Stop];
}
