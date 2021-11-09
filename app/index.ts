import { config } from 'dotenv';
import { startDiscordClient} from "./data/DiscordClient";


config();

const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());


startDiscordClient(true);



