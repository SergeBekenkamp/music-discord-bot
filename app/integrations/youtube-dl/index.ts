import {PlayIntegration, SearchResult} from "../../commands/playCommand";
import {AudioPlayer, createAudioResource} from "@discordjs/voice";
import {searchYoutube} from "../../search/searchYoutube";
import {youtubeDownloader} from "./youtubeDownloader";

type YoutubeSearchResult = SearchResult & {id: string};

export function createYoutubeDlPlayer(): PlayIntegration<YoutubeSearchResult> {
    return {
        async search(search: string): Promise<YoutubeSearchResult | undefined> {
            const result = await searchYoutube(search);
            if (!result) return undefined;
            return {
                id: result.id || '',
                title: result.title || '',
                image: result.thumbnails?.standard?.url,
                description: result.description,
            };
        },
        async play(song: YoutubeSearchResult, player: AudioPlayer): Promise<void> {
            const mp3Location = await youtubeDownloader(song.id);
            player.play(createAudioResource(mp3Location, {inlineVolume: true}));
        }
    }
}