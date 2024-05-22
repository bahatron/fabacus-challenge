import { resolve } from "path";
import { AppServer } from "../app/server";
import { Log } from "../services/logger";
import { Env } from "../services/env";
import { Session } from "../services/session";
import { REQUEST_LOGGER_MIDDLEWARE } from "../app/middleware/log-request";
import { REQUEST_ID_MIDDLEWARE } from "../app/middleware/request-id";
import { ERROR_HANDLER_MIDDLEWARE } from "../app/middleware/error-handler";

Session.run({}, async () => {
    {
        let server = await AppServer({
            routes: resolve(__dirname, "../**/*.route.*"),
            swagger: {
                enabled: true,
                info: {
                    title: "Swagger Docs",
                    description: "A collection of exposed endpoints",
                    version: "0.1.0",
                },
                securitySchemes: {
                    authHeader: {
                        in: "header",
                        name: "Authorization",
                        type: "apiKey",
                    },
                },
            },
            preRouteMiddleware: [
                REQUEST_LOGGER_MIDDLEWARE,
                REQUEST_ID_MIDDLEWARE,
            ],
            postRouteMiddleware: [ERROR_HANDLER_MIDDLEWARE],
        });

        server.listen(Env.PORT, () => {
            Log.debug(`debug mode enabled`);
            Log.info(`Server listening in port ${Env.PORT}`);
        });
    }
});
