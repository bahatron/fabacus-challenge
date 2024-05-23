import { Gone, NotAcceptable, NotFound } from "@bahatron/utils/lib/error";
import { fetchEvent } from "../fetch-event/fetch-event";
import { Redis } from "../../services/redis";
import { EventExtended, seatKey } from "../../models/event.schema";
import { Log } from "../../services/logger";

export async function holdSeat({
    eventId,
    seatId,
    userId,
}: {
    userId: string;
    eventId: string;
    seatId: string;
}) {
    let event = await fetchEvent(eventId);

    Log.debug({ userId, seatId, event }, "holding seat...");

    if (!Object.keys(event.seats).includes(seatId)) {
        throw NotFound("SEAT_NOT_FOUND");
    }

    if (event.seats[seatId] !== null) {
        throw Gone("SEAT_IS_TAKEN");
    }

    if (!canUserReserveSeat({ event, userId })) {
        throw NotAcceptable("USER_HAS_TOO_MANY_SEATS");
    }

    await Redis.set(seatKey(seatId), userId, {
        EX: event.reservationDuration,
    });
}

function canUserReserveSeat({
    event,
    userId,
}: {
    event: EventExtended;
    userId: string;
}) {
    if (!event.maxSeatsPerUser) return true;

    let seatsReservedByUser = Object.values(event.seats).filter(
        (id) => id === userId
    ).length;

    let result = seatsReservedByUser < event.maxSeatsPerUser;

    Log.debug({
        seatsReservedByUser,
        maxSeatsPerUser: event.maxSeatsPerUser,
        result,
    });

    return result;
}
