# Readme


### Installation

Run ```npm install```

Add a .env file to the root of the project (Same folder as this readme) fill in the following variables
```
CLIENT_TOKEN=''
CLIENT_ID=''
YOUTUBE_API_KEY=''
FFMPEG_PATH='C:\ffmpeg'
```
Client id = your discord application id which can be found by going to : https://discord.com/developers/applications and click or creating a new app there.

Client token = your discord application token which can be found under: https://discord.com/developers/applications/:ID:/bot

ffmpeg can be found here: https://www.ffmpeg.org/

to get a youtube api key go to the following page and follow the instruction: https://developers.google.com/youtube/registering_an_application

After you can run ```npm build``` or ```npm watch``` and then ```npm run```


### Features
Not that many right now it has a simple song queue and a play / stop command
I do have plans for better interaction support (next, stop, volume, queue controls)
And a system for supporting multiple different audio sources youtube, spotify, soundcloud etc.