import axios from "axios";
import { ReserveSeatRoute } from "./reserve-seat.route";
import { Event, seatKey } from "../../models/event.schema";
import { createEvent } from "../create-event/create-event";
import { cleanEventSeats } from "../../tests/utils";
import { randomUUID } from "crypto";
import { holdSeat } from "../hold-seat/hold-seat";

async function callReserveSeatEndpoint({ eventId, data }) {
    return axios({
        method: ReserveSeatRoute.method,
        url: ReserveSeatRoute.route.replace(`:eventId`, eventId),
        data,
    });
}

describe("Reserve Seat", () => {
    let event: Event;
    beforeAll(async () => {
        event = await createEvent({
            seats: 10,
        });
    });

    beforeEach(async () => {
        await cleanEventSeats(event.seats);
    });

    it("will respond with http 204 if seat is not taken", async () => {
        let response = await callReserveSeatEndpoint({
            eventId: event.id,
            data: { seatId: event.seats[0], userId: randomUUID() },
        });

        expect(response.status).toBe(204);
    });

    it("will respond with http 204 if seat is already taken by the same user", async () => {
        let userId = randomUUID();

        await holdSeat({
            eventId: event.id,
            seatId: event.seats[0],
            userId,
        });

        let response = await callReserveSeatEndpoint({
            eventId: event.id,
            data: {
                seatId: event.seats[0],
                userId,
            },
        });

        expect(response.status).toBe(204);
    });

    it("will respond with http 204 if seat is already taken by the same user", async () => {
        let userId = randomUUID();

        await holdSeat({
            eventId: event.id,
            seatId: event.seats[0],
            userId,
        });

        await expect(() =>
            callReserveSeatEndpoint({
                eventId: event.id,
                data: {
                    seatId: event.seats[0],
                    userId: randomUUID(),
                },
            })
        ).rejects.toThrow("410");
    });
});
