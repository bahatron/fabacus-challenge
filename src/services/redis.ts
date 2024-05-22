import { createClient, SetOptions } from "redis";
import { Log } from "./logger";
import { Env } from "./env";

export const Redis = createClient({
    url: Env.REDIS_URL,
    socket: {
        tls: false,
    },
});

Redis.connect().then(() => Log.info(`redis connection established`));
