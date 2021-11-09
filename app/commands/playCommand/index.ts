import {SlashCommandBuilder} from "@discordjs/builders";
import * as Discord from 'discord.js';
import {CommandInteractionOption, MessageEmbed} from 'discord.js';
import {AudioPlayer} from "@discordjs/voice";
import {getOrCreateGuild, SongQueue,} from "../../data/Guild";
import {createYoutubeDlPlayer} from "../../integrations/youtube-dl";
import {createYoutubeDlStreamer} from "../../integrations/youtube-stream";

const command = 'play';
const commandBuilder = new SlashCommandBuilder()
    .setName(command)
    .setDescription('Starts playing music from youtube in your current channel :)')
    .addStringOption(option => {
        return option.setName("search")
            .setDescription("A search term or youtube video id to play")
            .setRequired(true);
    });

function getValue(name: string, data: readonly CommandInteractionOption[]): CommandInteractionOption | undefined {
    return data.find(item => item.name === name);
}

export type SearchResult = {
    title: string,
    description?: string,
    image?: string,
    url?: string,
}

export type PlayIntegration<T extends SearchResult = SearchResult> = {
    search(search: string): Promise<T | undefined>;
    play(song: T, player: AudioPlayer): Promise<void>;
}

const integrations = {
    'youtube': createYoutubeDlPlayer,
    'stream': createYoutubeDlStreamer,
}

const handler = async (interaction: Discord.CommandInteraction) => {
    console.log('Handling play interaction')
    const searchValue = getValue("search", interaction.options.data)?.value as string ??'';
    const integrationKey: keyof typeof integrations = 'stream';

    const integration = integrations[integrationKey]();

    const searchResult = await integration.search(searchValue);

    const guildMember = await interaction.guild?.members.cache.get(interaction.user.id);

    const channelId = guildMember!.voice.channelId
    const guildId = interaction.guild?.id;
    if (!guildId) {
        throw new Error("Cannot find guildId");
    }

    if (!channelId) {
        await interaction.reply("You must be in a voice channel to use this command!");
        return;
    }

    if (!searchResult) {
        await interaction.reply(`Could not find a youtube video for the searchTerm: ${searchValue}`);
        return;
    }


    const channel = interaction.client.channels.cache.get(channelId);
    if (channel?.isVoice()) {
        const guild = await getOrCreateGuild(guildId);
        guild.queueSong(integration, searchResult, interaction.member?.user.username || '');

        const embed = createEmbed(guild.getQueue(), searchResult);
        await interaction.reply({
            embeds: [embed],
        });

        const voice = await guild.getOrJoinVoiceChannel(channelId)
        guild.startMusicQueue(voice);
    }
};

function createEmbed(queue: SongQueue, song: SearchResult) {
    let q = ``;
    for(let i = 1; i < queue.length && i < 5; i++) {
        q += `\n${i}. **${queue[i].search.title}** by: ${queue[i].requester}`;
    }

    const embed = new MessageEmbed()
        .addField(`Now queueing`, queue[queue.length -1].search.title)
        .addField('Currently playing', queue[0].search.title)
    if(q.length) {
        embed.addField("Current queue", q)
    }

    return embed;
}





export {
    commandBuilder,
    handler,
    command,
}
