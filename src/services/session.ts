import { AsyncLocalStorage } from "node:async_hooks";

export const Session = new AsyncLocalStorage<{
    request_id?: string;
    user?: string;
}>();
