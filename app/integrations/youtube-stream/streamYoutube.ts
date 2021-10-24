import streamify from 'youtube-audio-stream';
import * as stream from "stream";


export async function streamYoutube(youtubeUrl: string) {
    const streamy = streamify(youtubeUrl);
    const readable = new stream.Readable({
        read(size: number) {

        }
    });

    streamy.on('data', (chunk) => {
        readable.push(chunk);
    });

    return readable
}