import { JsonSchema } from "@bahatron/utils";
import { Route } from "../../app/route";
import { EventSchema } from "../../models/event.schema";
import { CreateEventRequest, createEvent } from "./create-event";
import { Log } from "../../services/logger";

export const CreateEventRoute = Route({
    method: "post",
    route: `/events`,
    docs: {
        requestBody: {
            required: true,
            schema: CreateEventRequest,
        },
        responses: {
            201: {
                schema: EventSchema,
            },
        },
    },
    handler: [
        async (req, res) => {
            let request = JsonSchema.validate(req.body, CreateEventRequest);

            let event = await createEvent(request);

            Log.info({ event }, `event created`);

            return res.status(201).json(event);
        },
    ],
});
