import {Command, getCommands} from "./getCommands";
import * as Discord from "discord.js";
import {Awaited} from "discord.js";

export async function createCommandHandler() {
    const commands = await getCommands();
    const commandMap = new Map<string, Command['handler']>();

    commands.forEach(command => {
        commandMap.set(command.command, command.handler);
    })

    return (interaction: Discord.Interaction): Awaited<void> => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        const commandHandler = commandMap.get(commandName);

        if(commandHandler) {
            commandHandler(interaction);
        } else {
            console.log(`could not find handler for command ${interaction.commandName}`);
        }
    }

}
