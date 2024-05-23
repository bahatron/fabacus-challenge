import { Log } from "../services/logger";
import { Redis } from "../services/redis";

export default async () => {
    await Redis.flushDb().then(() => Log.info(`Redis flushed`));
};
