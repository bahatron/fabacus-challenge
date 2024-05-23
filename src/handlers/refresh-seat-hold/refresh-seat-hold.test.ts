import axios from "axios";
import { Event } from "../../models/event.schema";
import { createEvent } from "../create-event/create-event";
import { cleanEventSeats } from "../../tests/utils";
import { randomUUID } from "crypto";
import { holdSeat } from "../hold-seat/hold-seat";
import { RefreshSeatHoldRoute } from "./refresh-seat-hold.route";
import { reserveSeat } from "../reserve-seat/reserve-seat";

async function callRefreshSeatHoldEndpoint({ eventId, data }) {
    return axios({
        method: RefreshSeatHoldRoute.method,
        url: RefreshSeatHoldRoute.route.replace(`:eventId`, eventId),
        data,
    });
}

describe("Refresh Seat Hold", () => {
    let event: Event;
    beforeAll(async () => {
        event = await createEvent({
            seats: 10,
        });
    });

    beforeEach(async () => {
        await cleanEventSeats(event.seats);
    });

    it("will respond with http 403 if seat is not taken", async () => {
        await expect(() =>
            callRefreshSeatHoldEndpoint({
                eventId: event.id,
                data: {
                    seatId: event.seats[0],
                    userId: randomUUID(),
                },
            })
        ).rejects.toThrow("403");
    });

    it("will respond with http 403 if seat is taken by a user", async () => {
        await reserveSeat({
            eventId: event.id,
            seatId: event.seats[0],
            userId: randomUUID(),
        });

        await expect(() =>
            callRefreshSeatHoldEndpoint({
                eventId: event.id,
                data: {
                    seatId: event.seats[0],
                    userId: randomUUID(),
                },
            })
        ).rejects.toThrow("403");
    });

    it("will respond with http 204 if seat is already taken by the same user", async () => {
        let userId = randomUUID();

        await holdSeat({
            eventId: event.id,
            seatId: event.seats[0],
            userId,
        });

        let response = await callRefreshSeatHoldEndpoint({
            eventId: event.id,
            data: {
                seatId: event.seats[0],
                userId,
            },
        });

        expect(response.status).toBe(204);
    });
});
