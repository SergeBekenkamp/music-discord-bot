import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    getVoiceConnection,
    joinVoiceChannel,
    NoSubscriberBehavior,
    VoiceConnection,
    VoiceConnectionStatus
} from "@discordjs/voice";

import {PlayIntegration, SearchResult} from "../commands/playCommand";
import {getDiscordClient} from "./DiscordClient";

export type SongQueue = Array<{
    integration: PlayIntegration,
    search: SearchResult,
    requester: string,
}>


const guilds = new Map<string, Guild>();

export function getOrCreateGuild(id: string): Guild {
    let guild = guilds.get(id);
    if (!guild) {
        guild = new Guild(id);
        guilds.set(id, guild);
    }
    return guild;
}

export class Guild {
    id: string;
    queue: SongQueue = [];
    player?: AudioPlayer;

    constructor(id: string ) {
        this.id = id;
    }



    public async getOrJoinVoiceChannel(channelId: string) {
        const client = getDiscordClient();
        const guild = await client.guilds.fetch(this.id);

        let voiceConnection = getVoiceConnection(this.id) || joinVoiceChannel({
            channelId: channelId,
            guildId: this.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
        });
        if (voiceConnection.state.status === VoiceConnectionStatus.Disconnected || voiceConnection.state.status === VoiceConnectionStatus.Destroyed) {
            voiceConnection = joinVoiceChannel({
                channelId: channelId,
                guildId: this.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: true,
            });
        }

        return voiceConnection;
    };

    public async startMusicQueue(voiceConnection: VoiceConnection) {
        const state = voiceConnection.state;
        if (state.status === VoiceConnectionStatus.Ready || state.status === VoiceConnectionStatus.Connecting || state.status === VoiceConnectionStatus.Signalling) {
            if (state.subscription?.player) {
                return state.subscription.player;
            }
        }

        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        voiceConnection.subscribe(player);
        let disconnectTimeout: NodeJS.Timeout | null = null;
        const playNext = () => {
            console.log('play next');
            const guildId = voiceConnection.joinConfig.guildId;
            const guild = getOrCreateGuild(guildId);
            const nextSong = guild.queue.shift();
            if (nextSong) {
                if(disconnectTimeout) {
                    clearTimeout(disconnectTimeout);
                    disconnectTimeout = null;
                }
                nextSong.integration.play(nextSong.search, player);
            } else {
                disconnectTimeout = setTimeout(() => voiceConnection.disconnect(), 5000);
            }
        }
        player.on(AudioPlayerStatus.Idle, playNext)

        voiceConnection.on(VoiceConnectionStatus.Disconnected, function () {
            voiceConnection.destroy();
        })
        playNext();
        return player;
    };

    public queueSong(integration: PlayIntegration, search: SearchResult, userName: string) {
        this.queue.push({
            integration,
            search,
            requester: userName
        });
    }

    public getQueue(): SongQueue {
        return this.queue;
    }

    public stopMusic() {
        const voiceConnection = getVoiceConnection(this.id)
        if (voiceConnection){
            voiceConnection.disconnect();
        }

    }

}


