import { ExpectationFailed, Gone, NotFound } from "@bahatron/utils/lib/error";
import { fetchEvent } from "../fetch-event/fetch-event";
import { Redis } from "../../services/redis";
import { seatKey } from "../../models/event.schema";
import { Log } from "../../services/logger";

export async function reserveSeat({
    eventId,
    userId,
    seatId,
}: {
    eventId: string;
    userId: string;
    seatId: string;
}) {
    let event = await fetchEvent(eventId);

    if (!Object.keys(event.seats).includes(seatId)) {
        throw NotFound("SEAT_NOT_FOUND");
    }

    Log.debug({
        userId,
        seat: event.seats[seatId],
    });

    if (event.seats[seatId] === null || event.seats[seatId] === userId) {
        await Redis.set(seatKey(seatId), userId);
    } else {
        throw Gone("SEAT_ALREADY_TAKEN");
    }
}
