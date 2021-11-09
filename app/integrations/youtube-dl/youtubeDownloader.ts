import YoutubeMp3Downloader from "youtube-mp3-downloader";
import * as fs from "fs";

export function youtubeDownloader(id: string): Promise<string>{
    const path = 'c:/ffmpeg';
    if(fs.existsSync(`${path}/${id}.mp3`)) {
        return Promise.resolve(`${path}/${id}.mp3`);
    }

    const YD = new YoutubeMp3Downloader({
        "ffmpegPath": "c:/ffmpeg/ffmpeg.exe",        // FFmpeg binary location
        "outputPath": "c:/ffmpeg",    // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 5,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    });


    const promise: Promise<string> = new Promise((resolve, reject) => {
        YD.download(id, `${id}.mp3`);
        YD.on('progress', (video) => {
            console.log(`Download progress: ${video.progress.percentage}`);
        })
        YD.on('finished', (err,data) => {
            console.log('finished download', data);
            setTimeout(() => {
                resolve(`${data.file}`)
            }, 100);

        })
        YD.on('error', (err) => {throw new Error(err)});
    })


    return promise;
}
