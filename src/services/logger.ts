import { Logger } from "@bahatron/utils";
import { Session } from "./session";
import { Env } from "./env";

export const Log = Logger.Logger({
    debug: Env.DEV_MODE && Env.DEBUG,
    pretty: Env.DEV_MODE,
    id: () => Session.getStore()?.request_id!,
});
