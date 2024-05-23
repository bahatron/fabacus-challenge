import axios from "axios";
import { CreateEventRoute } from "./create-event.route";
import { Redis } from "../../services/redis";
import { Event, eventKey } from "../../models/event.schema";
import { jsonParse } from "@bahatron/utils/lib/helpers";
import { Log } from "../../services/logger";

const VALID_SEAT_NUMBER = 10;
const INVALID_SEAT_NUMBER = 2;

describe("Create Event", () => {
    describe(`create event endpoint`, () => {
        async function callCreateEventEndpoint(data) {
            return axios<Event>({
                method: CreateEventRoute.method,
                url: CreateEventRoute.route,
                data,
            });
        }

        it(`returns http 400 if seats amount is not valid`, async () => {
            expect(() =>
                callCreateEventEndpoint({ seats: INVALID_SEAT_NUMBER })
            ).rejects.toThrow("400");
        });

        it("returns 201 if the request is valid", async () => {
            let response = await callCreateEventEndpoint({
                seats: VALID_SEAT_NUMBER,
            });

            expect(response.status).toBe(201);
        });

        it("stores the event on redis", async () => {
            let response = await callCreateEventEndpoint({
                seats: VALID_SEAT_NUMBER,
            });

            let event = jsonParse(await Redis.get(eventKey(response.data.id)));

            expect(event).toMatchObject(response.data);
        });
    });
});
