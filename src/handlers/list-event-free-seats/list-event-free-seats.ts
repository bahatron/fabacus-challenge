import { NotFound } from "@bahatron/utils/lib/error";
import { fetchEvent } from "../fetch-event/fetch-event";

export async function listEventFreeSeats(eventId: string): Promise<string[]> {
    let event = await fetchEvent(eventId);

    if (!event) throw NotFound("EVENT_NOT_FOUND");

    return Object.entries(event.seats).reduce(
        (emptySeats, [seatId, userId]) => {
            if (!userId) emptySeats.push(seatId);

            return emptySeats;
        },
        [] as string[]
    );
}
