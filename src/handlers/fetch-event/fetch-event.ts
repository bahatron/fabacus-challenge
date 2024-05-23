import { jsonParse } from "@bahatron/utils/lib/helpers";
import {
    Event,
    EventExtended,
    eventKey,
    seatKey,
} from "../../models/event.schema";
import { Redis } from "../../services/redis";
import { NotFound } from "@bahatron/utils/lib/error";

export async function fetchEvent(eventId: string): Promise<EventExtended> {
    let data = await Redis.get(eventKey(eventId));

    let event = jsonParse(data) as Event | undefined;

    if (!event) throw NotFound("EVENT_NOT_FOUND");

    return {
        ...event,
        seats: await fetchSeatInformation(event.seats),
    };
}

async function fetchSeatInformation(
    seats: string[]
): Promise<Record<string, string | null>> {
    let response = await Redis.mGet(seats.map(seatKey));

    return seats.reduce((map, item, index) => {
        map[item] = response[index];

        return map;
    }, {} as Record<string, string | null>);
}
