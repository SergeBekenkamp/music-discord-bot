import search, {YouTubeSearchOptions, YouTubeSearchResults} from "youtube-search";
import {streamYoutube} from "../integrations/youtube-stream/streamYoutube";

const searchOptions: YouTubeSearchOptions = {
    maxResults: 10,
    key: process.env.YOUTUBE_API_KEY,
};

export async function searchYoutube(searchValue: string): Promise<Partial<YouTubeSearchResults> | undefined> {
    if(searchValue)
    {
        let isId = false;
        if(searchValue.split(' ').length == 1) {
            try {
                await streamYoutube(`https://youtube.com/watch?v=${searchValue}`);
                isId = true;
            } catch (error) {
                console.log(error);
            }
        }

        const searchResults = await search(searchValue, searchOptions)
        const exactMatch = searchResults.results.find(x=> x.id === searchValue);
        return isId ? exactMatch ?? {
            id: searchValue,
            title: 'could not retrieve details',
        }  : searchResults.results[0]
    }
    return undefined;

}
