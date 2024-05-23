import { randomUUID } from "crypto";
import { Redis } from "../../services/redis";
import { jsonStringify } from "@bahatron/utils/lib/helpers";
import { JsonSchema } from "@bahatron/utils";
import { Event, eventKey } from "../../models/event.schema";
import { Static } from "@bahatron/utils/lib/json-schema";

export const CreateEventRequest = JsonSchema.Object({
    seats: JsonSchema.Integer({ minimum: 10, maximum: 1000 }),
    reservationDuration: JsonSchema.Optional(
        JsonSchema.Integer({
            default: 60,
        })
    ),
    maxSeatsPerUser: JsonSchema.Optional(JsonSchema.Integer()),
});

export async function createEvent({
    seats,
    reservationDuration = 60,
    maxSeatsPerUser,
}: Static<typeof CreateEventRequest>) {
    let event: Event = {
        id: randomUUID(),
        reservationDuration,
        maxSeatsPerUser,
        seats: Array(seats)
            .fill(null)
            .map(() => randomUUID()),
    };

    await Redis.set(eventKey(event.id), jsonStringify(event));

    return event;
}
