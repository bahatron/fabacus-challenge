import { Forbidden, NotFound } from "@bahatron/utils/lib/error";
import { fetchEvent } from "../fetch-event/fetch-event";
import { Redis } from "../../services/redis";
import { seatKey } from "../../models/event.schema";
import { Log } from "../../services/logger";

export async function refreshSeatHold({
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

    if (event.seats[seatId] === null || event.seats[seatId] !== userId) {
        throw Forbidden();
    }

    let ttl = await Redis.ttl(seatKey(seatId));

    if (ttl != -1) {
        await Redis.expire(seatKey(seatId), event.reservationDuration);
    }
}
