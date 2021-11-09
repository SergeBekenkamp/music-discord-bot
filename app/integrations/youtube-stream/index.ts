import {PlayIntegration, SearchResult} from "../../commands/playCommand";
import {searchYoutube} from "../../search/searchYoutube";
import {AudioPlayer, createAudioResource} from "@discordjs/voice";
import {streamYoutube} from "./streamYoutube";


type YoutubeSearchResult = SearchResult & {id: string};

export function createYoutubeDlStreamer(): PlayIntegration<YoutubeSearchResult> {
    return {
        async search(search: string): Promise<YoutubeSearchResult | undefined> {
            const result = await searchYoutube(search);
            if (!result) return undefined;
            return {
                id: result.id || '',
                title: result.title || '',
                image: result?.thumbnails?.standard?.url,
                description: result?.description,
            };
        },
        async play(song: YoutubeSearchResult, player: AudioPlayer): Promise<void> {
            const mp3Stream = await streamYoutube(`https://youtube.com/watch?v=${song.id}`);

            player.play(createAudioResource(mp3Stream, {inlineVolume: true}));
        }
    }
}

