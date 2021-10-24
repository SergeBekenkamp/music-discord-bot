import search, {YouTubeSearchOptions, YouTubeSearchResults} from "youtube-search";
import request from 'request-promise-native';

const searchOptions: YouTubeSearchOptions = {
    maxResults: 10,
    key: process.env.YOUTUBE_API_KEY,
};

export async function searchYoutube(searchValue: string): Promise<Partial<YouTubeSearchResults> | undefined> {
    const {
        YOUTUBE_API_KEY
    } = process.env;


    let isId = false;
    if (searchValue.split(' ').length == 1) {
        const result = await request(
            `https://www.googleapis.com/youtube/v3/videos?part=id&id=${searchValue}&key=${YOUTUBE_API_KEY}`,
            {json: true}
        );

        if (result?.items?.length === 1) {
            isId = true;
        }
    }

    const searchResults = await search(searchValue, searchOptions)
    const exactMatch = searchResults.results.find(x => x.id === searchValue);
    return isId ? exactMatch ?? {
        id: searchValue,
        title: 'could not retrieve details',
    } : searchResults.results.find(item => item.kind === 'youtube#video')


}
