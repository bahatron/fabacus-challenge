import { JsonSchema } from "@bahatron/utils";
import { Route } from "../../app/route";
import { EventSchema } from "../../models/event.schema";
import { Log } from "../../services/logger";
import { listEventFreeSeats } from "./list-event-free-seats";

export const ListEventFreeSeatsRoute = Route({
    method: `get`,
    route: `/events/:eventId/free-seats`,
    docs: {
        parameters: [
            {
                in: "path",
                name: "eventId",
                type: "string",
                description: "Event ID",
            },
        ],
        responses: {
            200: {
                schema: JsonSchema.Pick(EventSchema, ["seats"]),
            },
        },
    },
    handler: [
        async (req, res) => {
            let { eventId } = req.params;

            let availableSeats = await listEventFreeSeats(eventId);

            return res.status(200).json(availableSeats);
        },
    ],
});
