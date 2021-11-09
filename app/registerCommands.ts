import {getCommands} from "./commands/getCommands";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

export async function registerCommands(clientId: string, guildId: string, token: string) {

    const commandMap = await getCommands()
    const commands = commandMap.map(map => map.commandBuilder.toJSON!());

    const rest = new REST({ version: '9' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}
