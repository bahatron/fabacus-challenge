import { Log } from "../../services/logger";
import { Redis } from "../../services/redis";
import { Route } from "../route";
import { JsonSchema } from "@bahatron/utils";

export const PingRoute = Route({
    method: "get",
    route: "/ping",
    docs: {
        tags: ["APM"],
        description: "ping",
        responses: {
            200: {
                schema: JsonSchema.StringEnum([`pong`]),
            },
        },
    },
    handler: [
        async (req, res) => {
            let redisPing = await Redis.ping();
            Log.info({ redis: redisPing });

            return res.json("pong");
        },
    ],
});
