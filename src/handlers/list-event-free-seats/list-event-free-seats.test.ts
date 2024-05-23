import axios from "axios";
import { Event } from "../../models/event.schema";
import { createEvent } from "../create-event/create-event";
import { ListEventFreeSeatsRoute } from "./list-event-free-seats.route";
import { holdSeat } from "../hold-seat/hold-seat";
import { randomUUID } from "crypto";

async function callListEventFreeSeatsEndpoint(eventId: string) {
    return axios({
        method: ListEventFreeSeatsRoute.method,
        url: ListEventFreeSeatsRoute.route.replace(`:eventId`, eventId),
    });
}

describe("List Event's Free Seats", () => {
    let event: Event;
    beforeAll(async () => {
        event = await createEvent({
            seats: 20,
        });
    });

    it("returns http 200 and a list of events", async () => {
        let { data: freeSeats, status } = await callListEventFreeSeatsEndpoint(
            event.id
        );

        expect(status).toBe(200);
        expect(freeSeats).toEqual(event.seats);
    });

    it("won't return taken seats", async () => {
        let seats = event.seats.slice(0, 5);

        await Promise.all(
            seats.map((seatId) => {
                return holdSeat({
                    eventId: event.id,
                    seatId,
                    userId: randomUUID(),
                });
            })
        );

        let { data: freeSeats } = await callListEventFreeSeatsEndpoint(
            event.id
        );

        for (let seatId of seats) {
            expect(freeSeats).not.toContain(seatId);
        }
    });
});
