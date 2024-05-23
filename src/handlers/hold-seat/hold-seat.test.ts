import { randomUUID } from "crypto";
import { Event, seatKey } from "../../models/event.schema";
import { createEvent } from "../create-event/create-event";
import { Redis } from "../../services/redis";
import axios from "axios";
import { HoldSeatRoute } from "./hold-seat.route";
import { Log } from "../../services/logger";
import { pick } from "lodash";
import { userInfo } from "os";

const MAX_SEATS_PER_USER = 2;

async function callHoldSeatEndpoint({ eventId, data }) {
    return await axios({
        method: HoldSeatRoute.method,
        url: HoldSeatRoute.route.replace(`:eventId`, eventId),
        data,
    });
}

describe("Hold Seat", () => {
    let event: Event;
    beforeAll(async () => {
        event = await createEvent({
            seats: 50,
            maxSeatsPerUser: MAX_SEATS_PER_USER,
        });
    });

    afterEach(async () => {
        let multi = Redis.multi();

        for (let seat of event.seats) {
            multi.del(seatKey(seat));
        }

        await multi.exec();
    });

    describe("happy path", () => {
        it("creates a reservation and responds with http 204", async () => {
            let userId = randomUUID();
            for (let i = 5; i < 5 + MAX_SEATS_PER_USER; i++) {
                let res = await callHoldSeatEndpoint({
                    eventId: event.id,
                    data: {
                        userId,
                        seatId: event.seats[i],
                    },
                });

                expect(res.status).toBe(204);

                let reservation = await Redis.get(seatKey(event.seats[i]));

                expect(reservation).toEqual(userId);
            }
        });
    });

    describe("seat taken", () => {
        it("throws 410 if seat is already taken", async () => {
            let firstUser = randomUUID();
            let secondUser = randomUUID();

            await callHoldSeatEndpoint({
                eventId: event.id,
                data: {
                    seatId: event.seats[10],
                    userId: firstUser,
                },
            });

            await expect(async () => {
                await callHoldSeatEndpoint({
                    eventId: event.id,
                    data: {
                        seatId: event.seats[10],
                        userId: secondUser,
                    },
                });
            }).rejects.toThrow("410");
        });
    });

    describe("max reservations", () => {
        it("throws 406 if user goes above the max reservation allowed", async () => {
            let userId = randomUUID();

            for (let i = 0; i <= MAX_SEATS_PER_USER; i++) {
                let call = async () => {
                    await callHoldSeatEndpoint({
                        eventId: event.id,
                        data: {
                            userId,
                            seatId: event.seats[i],
                        },
                    });
                };

                if (i < MAX_SEATS_PER_USER) {
                    await call();
                } else {
                    await expect(call).rejects.toThrow("406");
                }
            }
        });
    });
});
